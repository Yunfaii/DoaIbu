import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, Calendar, Building2 } from 'lucide-react';
import { formatDate, getMatchColor, getMatchLabel } from '../../utils/helpers';

function JobCard({ job, matchScore }) {
  // Fallback logo if image not found
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextElementSibling.style.display = 'flex';
  };

  return (
    <motion.div 
      className="job-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Link to={`/jobs/${job.id}`} className="job-card-link">
        <div className="job-card-header">
          <div className="job-card-company">
            {/* Hospital Logo */}
            <div className="job-card-logo-wrapper">
              {job.hospital_logo ? (
                <>
                  <img 
                    src={job.hospital_logo} 
                    alt={job.hospital}
                    className="job-card-logo-img"
                    onError={handleImageError}
                  />
                  <div className="job-card-logo-fallback" style={{ display: 'none' }}>
                    🏥
                  </div>
                </>
              ) : (
                <div className="job-card-logo-fallback">
                  🏥
                </div>
              )}
            </div>
            <div>
              <h3 className="job-card-title">{job.title}</h3>
              <p className="job-card-company-name">{job.hospital}</p>
              {job.hospital_type && (
                <span className="job-card-hospital-type">
                  <Building2 size={12} />
                  {job.hospital_type}
                </span>
              )}
            </div>
          </div>
          {matchScore !== undefined && (
            <div className="job-card-match">
              <div 
                className="match-badge"
                style={{ backgroundColor: getMatchColor(matchScore) }}
              >
                {matchScore}%
              </div>
            </div>
          )}
        </div>

        <div className="job-card-details">
          <div className="job-card-info">
            <MapPin size={16} />
            <span>{job.location}</span>
          </div>
          <div className="job-card-info">
            <Briefcase size={16} />
            <span>{job.type}</span>
          </div>
          <div className="job-card-info">
            <Calendar size={16} />
            <span>Posted: {formatDate(job.posted)}</span>
          </div>
        </div>

        <div className="job-card-skills">
          {job.skills.slice(0, 4).map((skill, index) => (
            <span key={index} className="job-card-skill">
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className="job-card-skill job-card-skill-more">
              +{job.skills.length - 4}
            </span>
          )}
        </div>

        {matchScore !== undefined && (
          <div className="job-card-match-label">
            <span style={{ color: getMatchColor(matchScore) }}>
              {getMatchLabel(matchScore)}
            </span>
          </div>
        )}
      </Link>
    </motion.div>
  );
}

export default JobCard;