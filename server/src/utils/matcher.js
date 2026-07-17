// Calculate match score between healthcare professional and job
exports.calculateMatchScore = (user, job) => {
  let totalScore = 0;
  let maxScore = 0;

  // 1. SKILLS MATCH (30% weight)
  const skillsWeight = 30;
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

  // 2. CERTIFICATION MATCH (25% weight) - NEW FOR HEALTHCARE
  const certWeight = 25;
  if (user.certification && job.certification) {
    const matchedCerts = job.certification.filter(jobCert =>
      user.certification.some(userCert =>
        userCert.toLowerCase() === jobCert.toLowerCase() ||
        userCert.toLowerCase().includes(jobCert.toLowerCase()) ||
        jobCert.toLowerCase().includes(userCert.toLowerCase())
      )
    );
    const certScore = (matchedCerts.length / job.certification.length) * certWeight;
    totalScore += certScore;
    maxScore += certWeight;
  } else {
    // If job requires certification but user has none
    if (job.certification && job.certification.length > 0) {
      totalScore += 0;
      maxScore += certWeight;
    } else {
      totalScore += certWeight * 0.5;
      maxScore += certWeight;
    }
  }

  // 3. SPECIALIZATION MATCH (20% weight) - NEW FOR HEALTHCARE
  const specWeight = 20;
  if (user.specialization && job.specialization) {
    if (user.specialization.toLowerCase() === job.specialization.toLowerCase()) {
      totalScore += specWeight;
    } else if (
      user.specialization.toLowerCase().includes(job.specialization.toLowerCase()) ||
      job.specialization.toLowerCase().includes(user.specialization.toLowerCase())
    ) {
      totalScore += specWeight * 0.7;
    } else {
      totalScore += specWeight * 0.3;
    }
    maxScore += specWeight;
  } else {
    totalScore += specWeight * 0.3;
    maxScore += specWeight;
  }

  // 4. EXPERIENCE MATCH (15% weight)
  const expWeight = 15;
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

  // 5. LOCATION MATCH (10% weight)
  const locWeight = 10;
  if (user.location && job.location) {
    if (user.location.toLowerCase() === job.location.toLowerCase()) {
      totalScore += locWeight;
    } else if (user.location.toLowerCase().includes(job.location.toLowerCase()) ||
               job.location.toLowerCase().includes(user.location.toLowerCase())) {
      totalScore += locWeight * 0.6;
    } else {
      totalScore += locWeight * 0.2;
    }
    maxScore += locWeight;
  } else {
    totalScore += locWeight * 0.5;
    maxScore += locWeight;
  }

  // Calculate final percentage
  return Math.round((totalScore / maxScore) * 100);
};