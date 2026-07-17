import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, MapPin, Briefcase, Calendar, 
  Mail, Building, Tag, Award, CheckCircle, XCircle, Stethoscope
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
        setError('Lowongan tidak ditemukan');
        return;
      }
      setJob(jobData);

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
        <p>Memuat detail lowongan...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="job-detail-error">
        <h2>Lowongan Tidak Ditemukan</h2>
        <p>Lowongan yang Anda cari tidak tersedia atau telah dihapus.</p>
        <Link to="/jobs">
          <Button variant="primary">Kembali ke Lowongan</Button>
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
        Kembali ke Lowongan
      </Link>

      <div className="job-detail-grid">
        {/* Left Column - Job Info */}
        <div className="job-detail-main">
          <div className="job-detail-card">
            <div className="job-detail-header">
              <div className="job-detail-company-logo">
                {job.hospital_logo ? (
                  <img 
                    src={job.hospital_logo} 
                    alt={job.hospital}
                    style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '12px' }}
                  />
                ) : (
                  <Stethoscope size={36} color="#7C3AED" />
                )}
              </div>
              <div className="job-detail-header-info">
                <h1>{job.title}</h1>
                <p className="job-detail-company">{job.hospital}</p>
                {job.hospital_type && (
                  <span className="job-detail-hospital-type">{job.hospital_type}</span>
                )}
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
                <span>Diposting: {formatDate(job.posted)}</span>
              </div>
              {job.deadline && (
                <div className="meta-item">
                  <Calendar size={18} />
                  <span>Batas Pendaftaran: {formatDate(job.deadline)}</span>
                </div>
              )}
              {job.salary && (
                <div className="meta-item">
                  <Tag size={18} />
                  <span>{job.salary}</span>
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
              <h3>Sertifikasi yang Dibutuhkan</h3>
              <div className="skills-list">
                {job.certification && job.certification.map((cert, index) => (
                  <span key={index} className="skill-tag certification-tag">
                    <Award size={14} />
                    {cert}
                  </span>
                ))}
              </div>
            </div>

            <div className="job-detail-section">
              <h3>Pengalaman</h3>
              <p>{job.experience}</p>
            </div>

            {job.facilities && job.facilities.length > 0 && (
              <div className="job-detail-section">
                <h3>Fasilitas</h3>
                <ul className="facilities-list">
                  {job.facilities.map((facility, index) => (
                    <li key={index}>
                      <CheckCircle size={16} color="#7C3AED" />
                      {facility}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="job-detail-section">
              <h3>Informasi Kontak</h3>
              <div className="contact-info">
                <Mail size={18} />
                <span>{job.email || 'Tidak tersedia'}</span>
              </div>
              <div className="contact-info">
                <Building size={18} />
                <span>{job.hospital}</span>
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
              {isApplying ? 'Mengirim Lamaran...' : 'Lamar Sekarang'}
            </Button>
            <p className="apply-info">
              <CheckCircle size={16} color="#10B981" />
              Lamaran akan dikirim langsung ke email rekruter rumah sakit
            </p>
          </div>

          <div className="job-detail-profile">
            <h4>Profil Tenaga Kesehatan Anda</h4>
            <div className="profile-snapshot">
              <div className="profile-item">
                <span className="profile-label">Nama</span>
                <span>{user?.name || 'Belum diisi'}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Email</span>
                <span>{user?.email || 'Belum diisi'}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Profesi</span>
                <span>{user?.profession || 'Belum diisi'}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Spesialisasi</span>
                <span>{user?.specialization || 'Belum diisi'}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Sertifikasi</span>
                <span>{user?.certification?.join(', ') || 'Belum diisi'}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Pengalaman</span>
                <span>{user?.experience || 'Belum diisi'}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Lokasi</span>
                <span>{user?.location || 'Belum diisi'}</span>
              </div>
              <Link to="/profile" className="profile-edit-link">
                Edit Profil
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