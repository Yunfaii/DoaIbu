import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Briefcase, MapPin, Building, Calendar, 
  CheckCircle, Clock, ArrowRight, FileText
} from 'lucide-react';
import { useJobs } from '../../context/JobContext';
import { formatDate } from '../../utils/helpers';

function AppliedHistory() {
  const { getAppliedHistory, loading } = useJobs();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      const data = await getAppliedHistory();
      setApplications(data);
      setIsLoading(false);
    };
    fetchHistory();
  }, [getAppliedHistory]);

  if (isLoading || loading) {
    return (
      <div className="applied-history-loading">
        <div className="spinner"></div>
        <p>Memuat riwayat lamaran...</p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="applied-history-empty">
        <FileText size={64} color="#9CA3AF" />
        <h3>Belum Ada Lamaran</h3>
        <p>Kamu belum melamar pekerjaan apapun. Yuk cari lowongan sekarang!</p>
        <Link to="/jobs" className="btn btn-primary">
          Cari Lowongan
        </Link>
      </div>
    );
  }

  return (
    <div className="applied-history">
      <div className="applied-history-header">
        <h2>Riwayat Lamaran</h2>
        <p>Total {applications.length} lamaran terkirim</p>
      </div>

      <div className="applied-history-list">
        {applications.map((app, index) => (
          <motion.div 
            key={app.id}
            className="applied-history-item"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="applied-item-status">
              <div className="status-badge applied">
                <CheckCircle size={16} />
                {app.status}
              </div>
            </div>

            <div className="applied-item-content">
              <h3 className="applied-item-title">{app.job_title}</h3>
              <div className="applied-item-meta">
                <span className="meta-item">
                  <Building size={16} />
                  {app.hospital}
                </span>
                <span className="meta-item">
                  <MapPin size={16} />
                  {app.location}
                </span>
                <span className="meta-item">
                  <Calendar size={16} />
                  {formatDate(app.applied_at)}
                </span>
              </div>
              <div className="applied-item-actions">
                <Link to={`/jobs/${app.job_id}`} className="view-job-link">
                  Lihat Lowongan
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default AppliedHistory;
