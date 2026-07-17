const fs = require('fs');
const path = require('path');
const { calculateMatchScore } = require('../utils/matcher');

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
        job.hospital?.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.skills.some(function(skill) {
          return skill.toLowerCase().includes(query);
        }) ||
        job.specialization?.toLowerCase().includes(query) ||
        job.category?.toLowerCase().includes(query);
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
        hospital: job.hospital,
        email: job.email,
        status: 'Email sent to recruiter',
        timestamp: new Date().toISOString()
      }
    });
  }, 500);
};

exports.getMatchScore = function(req, res) {
  const id = parseInt(req.params.id);
  const userId = req.query.userId ? parseInt(req.query.userId) : null;
  
  console.log('📊 Match Score Request:');
  console.log('   Job ID:', id);
  console.log('   User ID:', userId);
  
  const jobs = getJobs();
  const job = jobs.find(function(j) { return j.id === id; });
  
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  
  const users = getUsers();
  let user;
  if (userId) {
    user = users.find(u => u.id === userId);
  }
  if (!user) {
    user = users[0];
  }
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  console.log('   User:', user.name, '| Profesi:', user.profession, '| Spesialisasi:', user.specialization);
  
  const score = calculateMatchScore(user, job);
  console.log('   Match Score:', score);
  
  // Calculate match details for display
  const matchDetails = {
    professionMatch: 0,
    specializationMatch: 0,
    experienceMatch: 0,
    locationMatch: 0
  };

  // Profession match detail
  if (user.profession && job.category) {
    const userProf = user.profession.toLowerCase().trim();
    const jobCat = job.category.toLowerCase().trim();
    if (userProf === jobCat) {
      matchDetails.professionMatch = 100;
    } else if (userProf.includes('dokter') && jobCat.includes('dokter')) {
      matchDetails.professionMatch = 80;
    } else if (userProf.includes('perawat') && jobCat.includes('perawat')) {
      matchDetails.professionMatch = 80;
    } else {
      matchDetails.professionMatch = 20;
    }
  } else {
    matchDetails.professionMatch = 30;
  }

  // Specialization match detail
  if (user.specialization && job.specialization) {
    const userSpec = user.specialization.toLowerCase().trim();
    const jobSpec = job.specialization.toLowerCase().trim();
    if (userSpec === jobSpec) {
      matchDetails.specializationMatch = 100;
    } else if (userSpec.includes(jobSpec) || jobSpec.includes(userSpec)) {
      matchDetails.specializationMatch = 70;
    } else {
      matchDetails.specializationMatch = 20;
    }
  } else if (user.specialization && !job.specialization) {
    matchDetails.specializationMatch = 50;
  } else {
    matchDetails.specializationMatch = 30;
  }

  // Experience match detail
  if (user.experience && job.experience) {
    const userYears = parseExperience(user.experience);
    const jobYears = parseExperience(job.experience);
    if (userYears >= jobYears) {
      matchDetails.experienceMatch = 100;
    } else if (userYears >= jobYears * 0.7) {
      matchDetails.experienceMatch = 70;
    } else if (userYears >= jobYears * 0.5) {
      matchDetails.experienceMatch = 50;
    } else {
      matchDetails.experienceMatch = 30;
    }
  } else if (user.experience && !job.experience) {
    matchDetails.experienceMatch = 50;
  } else {
    matchDetails.experienceMatch = 30;
  }

  // Location match detail
  if (user.location && job.location) {
    const userLoc = user.location.toLowerCase().trim();
    const jobLoc = job.location.toLowerCase().trim();
    if (userLoc === jobLoc) {
      matchDetails.locationMatch = 100;
    } else if (userLoc.includes('jakarta') && jobLoc.includes('jakarta')) {
      matchDetails.locationMatch = 80;
    } else if (jobLoc === 'remote') {
      matchDetails.locationMatch = 90;
    } else {
      matchDetails.locationMatch = 30;
    }
  } else {
    matchDetails.locationMatch = 30;
  }

  res.json({
    jobId: job.id,
    title: job.title,
    hospital: job.hospital,
    matchScore: score,
    matchDetails: matchDetails
  });
};

// Helper function to parse experience string to years
function parseExperience(expStr) {
  if (!expStr) return 0;
  
  const str = expStr.toLowerCase().trim();
  
  if (str.includes('kurang dari 1 tahun') || str.includes('<1')) return 0.5;
  if (str.includes('1 tahun') || str.includes('1 year')) return 1;
  if (str.includes('2 tahun') || str.includes('2 years')) return 2;
  if (str.includes('3 tahun') || str.includes('3 years')) return 3;
  if (str.includes('4 tahun') || str.includes('4 years')) return 4;
  if (str.includes('5 tahun') || str.includes('5 years')) return 5;
  if (str.includes('lebih dari 5 tahun') || str.includes('>5')) return 6;
  
  const rangeMatch = str.match(/(\d+)\s*-\s*(\d+)/);
  if (rangeMatch) {
    return (parseInt(rangeMatch[1]) + parseInt(rangeMatch[2])) / 2;
  }
  
  const numbers = str.match(/\d+/);
  if (numbers) {
    return parseInt(numbers[0]);
  }
  
  return 0;
}
