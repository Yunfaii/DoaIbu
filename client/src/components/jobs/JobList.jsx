import JobCard from './JobCard';
import { useJobs } from '../../context/JobContext';

function JobList({ jobs, loading, matchScores }) {
  if (loading) {
    return (
      <div className="job-list-loading">
        <div className="spinner"></div>
        <p>Loading jobs...</p>
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="job-list-empty">
        <p>Maaf Tidak ada lowongan yang ditemukan</p>
        <p className="job-list-empty-sub">Coba ubah filter atau keyword pencarian</p>
      </div>
    );
  }

  return (
    <div className="job-list">
      <div className="job-list-header">
        <p>Menampilkan <strong>{jobs.length}</strong> lowongan</p>
      </div>
      <div className="job-list-grid">
        {jobs.map(job => (
          <JobCard 
            key={job.id} 
            job={job} 
            matchScore={matchScores?.[job.id]}
          />
        ))}
      </div>
    </div>
  );
}

export default JobList;
