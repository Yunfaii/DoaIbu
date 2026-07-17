exports.calculateMatchScore = (user, job) => {
  let totalScore = 0;
  let maxScore = 0;

  const skillsWeight = 40;
  if (user.skills && job.skills) {
    const matchedSkills = job.skills.filter(jobSkill =>
      user.skills.some(userSkill =>
        userSkill.toLowerCase() === jobSkill.toLowerCase() ||
        userSkill.toLowerCase().includes(jobSkill.toLowerCase()) ||
        jobSkill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );
    const skillsScore = (matchedSkills.length / job.skills.length) * skillsWeight;
    totalScore += skillsScore;
    maxScore += skillsWeight;
  }

  const expWeight = 30;
  if (user.experience && job.experience) {
    const userYears = parseInt(user.experience) || 0;
    const jobYears = parseInt(job.experience) || 0;
    let expScore = 0;
    if (userYears >= jobYears) {
      expScore = expWeight;
    } else if (userYears >= jobYears * 0.7) {
      expScore = expWeight * 0.7;
    } else if (userYears >= jobYears * 0.5) {
      expScore = expWeight * 0.5;
    } else {
      expScore = expWeight * 0.3;
    }
    totalScore += expScore;
    maxScore += expWeight;
  } else {
    totalScore += expWeight * 0.5;
    maxScore += expWeight;
  }

  const locWeight = 20;
  if (user.location && job.location) {
    if (user.location.toLowerCase() === job.location.toLowerCase()) {
      totalScore += locWeight;
    } else if (job.location.toLowerCase() === 'remote') {
      totalScore += locWeight * 0.8;
    } else if (user.location.toLowerCase().includes('jakarta') && 
               job.location.toLowerCase().includes('jakarta')) {
      totalScore += locWeight * 0.7;
    } else {
      totalScore += locWeight * 0.3;
    }
  } else {
    totalScore += locWeight * 0.5;
  }
  maxScore += locWeight;

  const eduWeight = 10;
  if (user.education && job.description) {
    const eduKeywords = ['s1', 's2', 'd3', 'd4', 'sarjana', 'master'];
    const matchedEdu = eduKeywords.some(keyword =>
      user.education.toLowerCase().includes(keyword) &&
      job.description.toLowerCase().includes(keyword)
    );
    totalScore += matchedEdu ? eduWeight : eduWeight * 0.5;
  } else {
    totalScore += eduWeight * 0.5;
  }
  maxScore += eduWeight;

  return Math.round((totalScore / maxScore) * 100);
};
