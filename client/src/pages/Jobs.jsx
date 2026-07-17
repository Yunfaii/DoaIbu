import { useEffect } from 'react';
import { useJobs } from '../context/JobContext';
import { JobProvider } from '../context/JobContext';
import JobList from '../components/jobs/JobList';
import JobFilter from '../components/jobs/JobFilter';

function JobsContent() {
  const { jobs, loading, error, fetchJobs } = useJobs();

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="jobs-page">
      <div className="jobs-header">
        <h1>💼 Lowongan Kerja</h1>
        <p>Temukan pekerjaan yang sesuai dengan skill dan pengalamanmu</p>
      </div>

      <JobFilter />

      {error && (
        <div className="jobs-error">
          {error}
        </div>
      )}

      <JobList jobs={jobs} loading={loading} />
    </div>
  );
}

function Jobs() {
  return (
    <JobProvider>
      <JobsContent />
    </JobProvider>
  );
}

export default Jobs;
