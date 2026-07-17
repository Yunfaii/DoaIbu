import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, MapPin, Briefcase, Calendar, 
  Mail, Building, Tag, Award, CheckCircle, XCircle
} from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import ApplyModal from '../components/jobs/ApplyModal';
import MatchScore from '../components/jobs/MatchScore';
import { formatDate } from '../utils/helpers';

function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getJob, getMatchScore, applyToJob, loading } = useJobs();
  const { user } = useAuth();
  
  const [job, setJob] = useState(null);
  const [matchData, setMatchData] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyResult, setApplyResult] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const jobData = await getJob(parseInt(id));
      if (!jobData) {
        setError('Job not found');
        return;
      }
      setJob(jobData);

      // Get match score
      const match = await getMatchScore(parseInt(id));
      if (match) {
        setMatchData(match);
      }
    };
    fetchData();
  }, [id, getJob, getMatchScore]);

  const handleApply = async () => {
    setIsApplying(true);
    const result = await applyToJob(parseInt(id));
    if (result) {
      setApplyResult(result);
      setShowApplyModal(true);
    }
    setIsApplying(false);
  };

  const handleCloseModal = () => {
    setShowApplyModal(false);
    navigate('/jobs');
  };

  if (loading) {
    return (
      <div className="job-detail-loading">
        <div className="spinner"></div>
        <p>Loading job details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="job-detail-error">
        <h2>😕 Job Not Found</h2>
        <p>The job you're looking for doesn't exist or has been removed.</p>
        <Link to="/jobs">
          <Button variant="primary">Back to Jobs</Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div 
      className="job-detail-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Link to="/jobs" className="job-detail-back">
        <ArrowLeft size={20} />
        Back to Jobs
      </Link>

      <div className="job-detail-grid">
        {/* Left Column - Job Info */}
        <div className="job-detail-main">
          <div className="job-detail-card">
            <div className="job-detail-header">
              <div className="job-detail-company-logo">
                {job.company_logo || '🏢'}
              </div>
              <div className="job-detail-header-info">
                <h1>{job.title}</h1>
                <p className="job-detail-company">{job.company}</p>
              </div>
            </div>

            <div className="job-detail-meta">
              <div className="meta-item">
                <MapPin size={18} />
                <span>{job.location}</span>
              </div>
              <div className="meta-item">
                <Briefcase size={18} />
                <span>{job.type}</span>
              </div>
              <div className="meta-item">
                <Calendar size={18} />
                <span>Posted: {formatDate(job.posted)}</span>
              </div>
              {job.deadline && (
                <div className="meta-item">
                  <Calendar size={18} />
                  <span>Deadline: {formatDate(job.deadline)}</span>
                </div>
              )}
            </div>

            <div className="job-detail-section">
              <h3>Deskripsi Pekerjaan</h3>
              <p>{job.description}</p>
            </div>

            <div className="job-detail-section">
              <h3>Kualifikasi</h3>
              <div className="skills-list">
                {job.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    <Tag size={14} />
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="job-detail-section">
              <h3>Pengalaman</h3>
              <p>{job.experience}</p>
            </div>

            <div className="job-detail-section">
              <h3>Informasi Kontak</h3>
              <div className="contact-info">
                <Mail size={18} />
                <span>{job.email || 'Not provided'}</span>
              </div>
              <div className="contact-info">
                <Building size={18} />
                <span>{job.company}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Match Score & Apply */}
        <div className="job-detail-sidebar">
          {matchData && (
            <MatchScore matchData={matchData} />
          )}

          <div className="job-detail-actions">
            <Button 
              variant="primary" 
              size="large"
              onClick={handleApply}
              disabled={isApplying}
              className="apply-btn-full"
            >
              {isApplying ? 'Mengirim Lamaran...' : 'Apply Now'}
            </Button>
            <p className="apply-info">
              <CheckCircle size={16} color="#10B981" />
              Lamaran akan dikirim langsung ke email recruiter
            </p>
          </div>

          <div className="job-detail-profile">
            <h4>Profil Anda</h4>
            <div className="profile-snapshot">
              <div className="profile-item">
                <span className="profile-label">Nama</span>
                <span>{user?.name}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Email</span>
                <span>{user?.email}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Skills</span>
                <span>{user?.skills?.join(', ') || 'Not set'}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Pengalaman</span>
                <span>{user?.experience || 'Not set'}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Lokasi</span>
                <span>{user?.location || 'Not set'}</span>
              </div>
              <Link to="/profile" className="profile-edit-link">
                Edit Profile →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && applyResult && (
        <ApplyModal 
          result={applyResult}
          onClose={handleCloseModal}
        />
      )}
    </motion.div>
  );
}

export default JobDetail;
