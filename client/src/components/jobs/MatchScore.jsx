import { motion } from 'framer-motion';
import { Award, CheckCircle, XCircle, AlertCircle, Stethoscope, Briefcase, MapPin, Star } from 'lucide-react';
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

  const matchItems = [
    { key: 'professionMatch', label: 'Profesi', icon: <Stethoscope size={16} /> },
    { key: 'specializationMatch', label: 'Spesialisasi', icon: <Star size={16} /> },
    { key: 'experienceMatch', label: 'Pengalaman', icon: <Briefcase size={16} /> },
    { key: 'locationMatch', label: 'Lokasi', icon: <MapPin size={16} /> }
  ];

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
        <h4>Detail Kecocokan</h4>
        {matchItems.map(({ key, label, icon }) => {
          const score = matchDetails[key] || 0;
          const scoreColor = getMatchColor(score);
          return (
            <div key={key} className="match-detail-item">
              <div className="match-detail-label">
                {getScoreIcon(score)}
                {icon}
                <span>{label}</span>
              </div>
              <div className="match-detail-bar">
                <div 
                  className="match-detail-fill"
                  style={{ 
                    width: `${Math.min(100, score)}%`,
                    backgroundColor: scoreColor
                  }}
                />
              </div>
              <span className="match-detail-percent">
                {Math.round(score)}%
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default MatchScore;
