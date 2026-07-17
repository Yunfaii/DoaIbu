// Calculate match score between user (tenaga kesehatan) and job
exports.calculateMatchScore = (user, job) => {
  let totalScore = 0;
  let maxScore = 0;

  // 1. PROFESSION MATCH (30%)
  const profWeight = 30;
  if (user.profession && job.category) {
    const userProf = user.profession.toLowerCase().trim();
    const jobCat = job.category.toLowerCase().trim();
    
    // Mapping profesi ke category
    const professionMap = {
      'dokter': ['doctor', 'dokter', 'dokter spesialis'],
      'dokter spesialis': ['doctor', 'dokter spesialis', 'dokter'],
      'perawat': ['nurse', 'perawat'],
      'bidan': ['midwife', 'bidan'],
      'apoteker': ['pharmacist', 'apoteker'],
      'analis kesehatan': ['laboratory', 'analis kesehatan', 'tenaga laboratorium'],
      'tenaga laboratorium medis': ['laboratory', 'analis kesehatan', 'tenaga laboratorium'],
      'ahli gizi': ['nutritionist', 'ahli gizi'],
      'fisioterapis': ['physiotherapist', 'fisioterapis'],
      'radiografer': ['radiographer', 'radiografer'],
      'tenaga kesehatan masyarakat': ['public health', 'kesehatan masyarakat']
    };
    
    // Cek apakah profesi user cocok dengan category job
    const userProfLower = userProf.toLowerCase();
    const jobCatLower = jobCat.toLowerCase();
    
    // Exact match
    if (userProfLower === jobCatLower) {
      totalScore += profWeight;
    } 
    // Check mapping
    else if (professionMap[userProfLower] && professionMap[userProfLower].some(cat => jobCatLower.includes(cat) || cat.includes(jobCatLower))) {
      totalScore += profWeight * 0.9;
    }
    // Partial match (misal: dokter vs dokter spesialis)
    else if (userProfLower.includes('dokter') && jobCatLower.includes('dokter')) {
      totalScore += profWeight * 0.8;
    }
    else if (userProfLower.includes('perawat') && jobCatLower.includes('perawat')) {
      totalScore += profWeight * 0.8;
    }
    else {
      totalScore += profWeight * 0.2;
    }
    maxScore += profWeight;
  } else {
    totalScore += profWeight * 0.3;
    maxScore += profWeight;
  }

  // 2. SPECIALIZATION MATCH (30%)
  const specWeight = 30;
  if (user.specialization && job.specialization) {
    const userSpec = user.specialization.toLowerCase().trim();
    const jobSpec = job.specialization.toLowerCase().trim();
    
    // Exact match
    if (userSpec === jobSpec) {
      totalScore += specWeight;
    } 
    // Partial match
    else if (userSpec.includes(jobSpec) || jobSpec.includes(userSpec)) {
      totalScore += specWeight * 0.7;
    }
    // Similar specialization (misal: dokter umum vs general practitioner)
    else {
      const specKeywords = {
        'umum': ['general', 'general practitioner', 'umum'],
        'anak': ['pediatrics', 'paediatrics', 'anak'],
        'kandungan': ['obstetrics', 'gynecology', 'obsgyn', 'kandungan'],
        'bedah': ['surgery', 'surgeon', 'bedah'],
        'kulit': ['dermatology', 'skin', 'kulit'],
        'jantung': ['cardiology', 'heart', 'jantung'],
        'saraf': ['neurology', 'neurosurgery', 'saraf'],
        'mata': ['ophthalmology', 'eye', 'mata'],
        'tht': ['ent', 'ear', 'nose', 'throat', 'tht'],
        'icu': ['critical care', 'intensive care', 'icu'],
        'gigi': ['dentistry', 'dental', 'gigi'],
        'klinis': ['clinical', 'klinis'],
        'farmasi': ['pharmacy', 'farmasi']
      };
      
      let matched = false;
      for (const [key, values] of Object.entries(specKeywords)) {
        if ((userSpec.includes(key) || values.some(v => userSpec.includes(v))) &&
            (jobSpec.includes(key) || values.some(v => jobSpec.includes(v)))) {
          totalScore += specWeight * 0.6;
          matched = true;
          break;
        }
      }
      
      if (!matched) {
        totalScore += specWeight * 0.2;
      }
    }
    maxScore += specWeight;
  } else if (user.specialization && !job.specialization) {
    // User punya spesialisasi tapi job tidak butuh spesialisasi
    totalScore += specWeight * 0.5;
    maxScore += specWeight;
  } else {
    totalScore += specWeight * 0.3;
    maxScore += specWeight;
  }

  // 3. EXPERIENCE MATCH (20%)
  const expWeight = 20;
  if (user.experience && job.experience) {
    const userYears = parseExperience(user.experience);
    const jobYears = parseExperience(job.experience);
    
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
  } else if (user.experience && !job.experience) {
    totalScore += expWeight * 0.5;
    maxScore += expWeight;
  } else {
    totalScore += expWeight * 0.3;
    maxScore += expWeight;
  }

  // 4. LOCATION MATCH (20%)
  const locWeight = 20;
  if (user.location && job.location) {
    const userLoc = user.location.toLowerCase().trim();
    const jobLoc = job.location.toLowerCase().trim();
    
    // Exact match
    if (userLoc === jobLoc) {
      totalScore += locWeight;
    } 
    // Same city (Jakarta Pusat vs Jakarta Selatan)
    else if (userLoc.includes('jakarta') && jobLoc.includes('jakarta')) {
      totalScore += locWeight * 0.8;
    }
    // Remote job - user bisa dari mana saja
    else if (jobLoc === 'remote') {
      totalScore += locWeight * 0.9;
    }
    else {
      totalScore += locWeight * 0.3;
    }
    maxScore += locWeight;
  } else {
    totalScore += locWeight * 0.3;
    maxScore += locWeight;
  }

  // Calculate final percentage
  return Math.round((totalScore / maxScore) * 100);
};

// Helper function to parse experience string to years
function parseExperience(expStr) {
  if (!expStr) return 0;
  
  const str = expStr.toLowerCase().trim();
  
  // Handle specific formats
  if (str.includes('kurang dari 1 tahun') || str.includes('<1')) return 0.5;
  if (str.includes('1 tahun') || str.includes('1 year')) return 1;
  if (str.includes('2 tahun') || str.includes('2 years')) return 2;
  if (str.includes('3 tahun') || str.includes('3 years')) return 3;
  if (str.includes('4 tahun') || str.includes('4 years')) return 4;
  if (str.includes('5 tahun') || str.includes('5 years')) return 5;
  if (str.includes('lebih dari 5 tahun') || str.includes('>5')) return 6;
  
  // Handle range format: "2-5 years"
  const rangeMatch = str.match(/(\d+)\s*-\s*(\d+)/);
  if (rangeMatch) {
    return (parseInt(rangeMatch[1]) + parseInt(rangeMatch[2])) / 2;
  }
  
  // Try to extract number
  const numbers = str.match(/\d+/);
  if (numbers) {
    return parseInt(numbers[0]);
  }
  
  return 0;
}
