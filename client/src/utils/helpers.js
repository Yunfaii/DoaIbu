// Format date
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

// Truncate text
export const truncateText = (text, maxLength = 150) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Get match color
export const getMatchColor = (score) => {
  if (score >= 80) return '#10B981'; // green
  if (score >= 60) return '#F59E0B'; // yellow
  if (score >= 40) return '#F97316'; // orange
  return '#EF4444'; // red
};

// Get match label
export const getMatchLabel = (score) => {
  if (score >= 80) return 'Excellent Match!';
  if (score >= 60) return 'Good Match';
  if (score >= 40) return 'Fair Match';
  return 'Low Match';
};
