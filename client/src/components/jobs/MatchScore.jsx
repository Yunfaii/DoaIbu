import { motion } from 'framer-motion';
import { Award, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { getMatchColor, getMatchLabel } from '../../utils/helpers';

function MatchScore({ matchData }) {
  const { matchScore, matchDetails } = matchData;
  const color = getMatchColor(matchScore);
  const label = getMatchLabel(matchScore);

  const getScoreIcon = (score) => {
    if (score >= 70) return <CheckCircle size={16} color="#10B981" />;
    if (score >= 40) return <AlertCircle size={16} color="#F59E0B" />;
    return <XCircle size={16} color="#EF4444" />;
  };

  return (
    <motion.div 
      className="match-score-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="match-score-header">
        <Award size={24} color={color} />
        <h3>Match Score</h3>
      </div>

      <div className="match-score-circle-container">
        <div className="match-score-circle" style={{ borderColor: color }}>
          <span className="match-score-number" style={{ color }}>
            {matchScore}%
          </span>
          <span className="match-score-label" style={{ color }}>
            {label}
          </span>
        </div>
      </div>

      <div className="match-details">
        <h4>Match Details</h4>
        <div className="match-detail-item">
          <div className="match-detail-label">
            {getScoreIcon(matchDetails.skillsMatch)}
            <span>Skills</span>
          </div>
          <div className="match-detail-bar">
            <div 
              className="match-detail-fill"
              style={{ 
                width: `${Math.min(100, matchDetails.skillsMatch)}%`,
                backgroundColor: getMatchColor(matchDetails.skillsMatch)
              }}
            />
          </div>
          <span className="match-detail-percent">
            {Math.round(matchDetails.skillsMatch)}%
          </span>
        </div>

        <div className="match-detail-item">
          <div className="match-detail-label">
            {getScoreIcon(matchDetails.experienceMatch)}
            <span>Experience</span>
          </div>
          <div className="match-detail-bar">
            <div 
              className="match-detail-fill"
              style={{ 
                width: `${Math.min(100, matchDetails.experienceMatch)}%`,
                backgroundColor: getMatchColor(matchDetails.experienceMatch)
              }}
            />
          </div>
          <span className="match-detail-percent">
            {Math.round(matchDetails.experienceMatch)}%
          </span>
        </div>

        <div className="match-detail-item">
          <div className="match-detail-label">
            {getScoreIcon(matchDetails.locationMatch)}
            <span>Location</span>
          </div>
          <div className="match-detail-bar">
            <div 
              className="match-detail-fill"
              style={{ 
                width: `${Math.min(100, matchDetails.locationMatch)}%`,
                backgroundColor: getMatchColor(matchDetails.locationMatch)
              }}
            />
          </div>
          <span className="match-detail-percent">
            {Math.round(matchDetails.locationMatch)}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default MatchScore;
