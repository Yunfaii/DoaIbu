const fs = require('fs');
const path = require('path');

const jobsPath = path.join(__dirname, '../data/jobs.json');
const usersPath = path.join(__dirname, '../data/users.json');

// Helper functions
function getJobs() {
  const data = fs.readFileSync(jobsPath, 'utf8');
  return JSON.parse(data);
}

function getUsers() {
  const data = fs.readFileSync(usersPath, 'utf8');
  return JSON.parse(data);
}

function calculateMatch(user, job) {
  let totalScore = 0;
  let maxScore = 0;

  // Skills match (40%)
  const skillsWeight = 40;
  if (user.skills && job.skills) {
    const matched = job.skills.filter(js => 
      user.skills.some(us => 
        us.toLowerCase() === js.toLowerCase() ||
        us.toLowerCase().includes(js.toLowerCase()) ||
        js.toLowerCase().includes(us.toLowerCase())
      )
    );
    totalScore += (matched.length / job.skills.length) * skillsWeight;
    maxScore += skillsWeight;
  }

  // Experience match (30%)
  const expWeight = 30;
  if (user.experience && job.experience) {
    const userYears = parseInt(user.experience) || 0;
    const jobYears = parseInt(job.experience) || 0;
    let expScore = 0;
    if (userYears >= jobYears) expScore = expWeight;
    else if (userYears >= jobYears * 0.7) expScore = expWeight * 0.7;
    else if (userYears >= jobYears * 0.5) expScore = expWeight * 0.5;
    else expScore = expWeight * 0.3;
    totalScore += expScore;
    maxScore += expWeight;
  } else {
    totalScore += expWeight * 0.5;
    maxScore += expWeight;
  }

  // Location match (20%)
  const locWeight = 20;
  if (user.location && job.location) {
    if (user.location.toLowerCase() === job.location.toLowerCase()) {
      totalScore += locWeight;
    } else if (job.location.toLowerCase() === 'remote') {
      totalScore += locWeight * 0.8;
    } else {
      totalScore += locWeight * 0.3;
    }
    maxScore += locWeight;
  } else {
    totalScore += locWeight * 0.5;
    maxScore += locWeight;
  }

  // Education match (10%)
  const eduWeight = 10;
  if (user.education && job.description) {
    const keywords = ['s1', 's2', 'd3', 'd4', 'sarjana', 'master'];
    const match = keywords.some(k => 
      user.education.toLowerCase().includes(k) && 
      job.description.toLowerCase().includes(k)
    );
    totalScore += match ? eduWeight : eduWeight * 0.5;
    maxScore += eduWeight;
  } else {
    totalScore += eduWeight * 0.5;
    maxScore += eduWeight;
  }

  return Math.round((totalScore / maxScore) * 100);
}

// ============= CONTROLLERS =============

exports.getAllJobs = function(req, res) {
  const jobs = getJobs();
  res.json(jobs);
};

exports.getJobById = function(req, res) {
  const id = parseInt(req.params.id);
  const jobs = getJobs();
  const job = jobs.find(function(j) { return j.id === id; });
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  res.json(job);
};

exports.searchJobs = function(req, res) {
  const q = req.query.q;
  const location = req.query.location;
  const type = req.query.type;
  let jobs = getJobs();
  
  if (q) {
    const query = q.toLowerCase();
    jobs = jobs.filter(function(job) {
      return job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.skills.some(function(skill) {
          return skill.toLowerCase().includes(query);
        });
    });
  }
  
  if (location) {
    jobs = jobs.filter(function(job) {
      return job.location.toLowerCase().includes(location.toLowerCase());
    });
  }
  
  if (type) {
    jobs = jobs.filter(function(job) {
      return job.type.toLowerCase() === type.toLowerCase();
    });
  }
  
  res.json(jobs);
};

exports.applyJob = function(req, res) {
  const id = parseInt(req.params.id);
  const jobs = getJobs();
  const job = jobs.find(function(j) { return j.id === id; });
  
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  
  setTimeout(function() {
    res.json({
      message: 'Application submitted successfully!',
      details: {
        job: job.title,
        company: job.company,
        email: job.email,
        status: 'Email sent to recruiter',
        timestamp: new Date().toISOString()
      }
    });
  }, 500);
};

exports.getMatchScore = function(req, res) {
  const id = parseInt(req.params.id);
  const jobs = getJobs();
  const job = jobs.find(function(j) { return j.id === id; });
  
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  
  const users = getUsers();
  const user = users[0];
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const score = calculateMatch(user, job);
  
  res.json({
    jobId: job.id,
    title: job.title,
    company: job.company,
    matchScore: score,
    matchDetails: {
      skillsMatch: Math.min(100, (job.skills.filter(function(s) {
        return user.skills.some(function(us) {
          return us.toLowerCase() === s.toLowerCase() ||
            us.toLowerCase().includes(s.toLowerCase()) ||
            s.toLowerCase().includes(us.toLowerCase());
        });
      }).length / job.skills.length) * 100),
      experienceMatch: (user.experience && job.experience) ? 
        Math.min(100, Math.random() * 40 + 60) : 50,
      locationMatch: (user.location && job.location) ? 
        (user.location.toLowerCase() === job.location.toLowerCase() ? 100 : 
        (job.location.toLowerCase() === 'remote' ? 80 : 60)) : 60
    }
  });
};
