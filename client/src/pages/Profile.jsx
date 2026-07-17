import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, Mail, Briefcase, MapPin, Code, 
  GraduationCap, Link as LinkIcon, Save, 
  Loader, CheckCircle, AlertCircle, Camera, Edit2, Award, Stethoscope
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/profile';

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const professionOptions = [
    'Dokter',
    'Dokter Spesialis',
    'Perawat',
    'Bidan',
    'Apoteker',
    'Analis Kesehatan',
    'Tenaga Laboratorium Medis',
    'Ahli Gizi',
    'Fisioterapis',
    'Radiografer',
    'Tenaga Kesehatan Masyarakat'
  ];

  const specializationOptions = [
    'Dokter Umum',
    'Dokter Gigi',
    'Dokter Anak',
    'Dokter Kandungan',
    'Dokter Bedah',
    'Dokter Kulit',
    'Dokter Jantung',
    'Dokter Saraf',
    'Dokter Mata',
    'Dokter THT',
    'Perawat ICU',
    'Perawat Bedah',
    'Perawat Anak',
    'Bidan',
    'Apoteker Klinis',
    'Analis Kesehatan',
    'Ahli Gizi Klinis',
    'Fisioterapis',
    'Radiografer'
  ];

  const experienceOptions = [
    'Kurang dari 1 tahun',
    '1 tahun',
    '2 tahun',
    '3 tahun',
    '4 tahun',
    '5 tahun',
    'Lebih dari 5 tahun'
  ];

  const locationOptions = [
    'Jakarta Pusat',
    'Jakarta Selatan',
    'Jakarta Timur',
    'Jakarta Barat',
    'Jakarta Utara',
    'Bandung',
    'Yogyakarta',
    'Surabaya',
    'Bekasi',
    'Tangerang',
    'Remote'
  ];

  const educationOptions = [
    'S1 Kedokteran',
    'S1 Keperawatan',
    'D3 Kebidanan',
    'S1 Farmasi',
    'S1 Kesehatan Masyarakat',
    'S1 Gizi',
    'S1 Fisioterapi',
    'S1 Radiologi',
    'D3 Analis Kesehatan',
    'S1 Teknik Medis',
    'S2 Kedokteran Spesialis',
    'S2 Kesehatan Masyarakat'
  ];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profession: '',
    specialization: '',
    skills: '',
    certification: '',
    experience: '',
    location: '',
    education: '',
    license_number: '',
    portfolio: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const url = user?.id ? `${API_URL}?userId=${user.id}` : API_URL;
        const response = await axios.get(url);
        const data = response.data;
        setProfile(data);
        setFormData({
          name: data.name || '',
          email: data.email || '',
          profession: data.profession || '',
          specialization: data.specialization || '',
          skills: data.skills ? data.skills.join(', ') : '',
          certification: data.certification ? data.certification.join(', ') : '',
          experience: data.experience || '',
          location: data.location || '',
          education: data.education || '',
          license_number: data.license_number || '',
          portfolio: data.portfolio || ''
        });
      } catch (err) {
        setError('Gagal memuat profil');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        userId: user?.id,
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        certification: formData.certification.split(',').map(s => s.trim()).filter(s => s)
      };
      
      const response = await axios.put(API_URL, payload);
      setProfile(response.data.profile);
      setSuccess('Profil berhasil diperbarui');
      setIsEditing(false);
      
      const updatedUser = { 
        ...user, 
        ...payload,
        id: user?.id
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal memperbarui profil');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: profile?.name || '',
      email: profile?.email || '',
      profession: profile?.profession || '',
      specialization: profile?.specialization || '',
      skills: profile?.skills ? profile.skills.join(', ') : '',
      certification: profile?.certification ? profile.certification.join(', ') : '',
      experience: profile?.experience || '',
      location: profile?.location || '',
      education: profile?.education || '',
      license_number: profile?.license_number || '',
      portfolio: profile?.portfolio || ''
    });
    setError('');
    setSuccess('');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Memuat profil...</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="profile-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="profile-header">
        <h1>Profil Tenaga Kesehatan</h1>
        <p>Kelola informasi pribadi dan kualifikasi kesehatan Anda</p>
      </div>

      <div className="profile-grid">
        <div className="profile-card">
          <div className="profile-avatar">
            <div className="avatar-circle">
              <span className="avatar-letter">
                {profile?.name?.charAt(0) || 'T'}
              </span>
            </div>
            <button className="avatar-edit-btn">
              <Camera size={16} />
            </button>
          </div>
          <h2 className="profile-name">{profile?.name || 'Tenaga Kesehatan'}</h2>
          <p className="profile-email">{profile?.email}</p>
          {profile?.profession && (
            <p className="profile-profession">
              <Stethoscope size={16} />
              {profile.profession}
            </p>
          )}
          
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-number">{profile?.skills?.length || 0}</span>
              <span className="stat-label">Keahlian</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">{profile?.certification?.length || 0}</span>
              <span className="stat-label">Sertifikasi</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">{profile?.experience || '0'}</span>
              <span className="stat-label">Pengalaman</span>
            </div>
          </div>

          <button onClick={handleLogout} className="profile-logout-btn">
            Keluar
          </button>
        </div>

        <div className="profile-form-card">
          <div className="profile-form-header">
            <h3>{isEditing ? 'Edit Profil Tenaga Kesehatan' : 'Informasi Profil'}</h3>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="profile-edit-btn">
                <Edit2 size={18} />
                Edit Profil
              </button>
            )}
          </div>

          {error && (
            <div className="profile-error">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {success && (
            <div className="profile-success">
              <CheckCircle size={18} />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label>
                  <User size={16} />
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Nama lengkap"
                />
              </div>
              <div className="form-group">
                <label>
                  <Mail size={16} />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled={true}
                  placeholder="Email"
                  style={{ background: '#f3f4f6', cursor: 'not-allowed' }}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <Stethoscope size={16} />
                  Profesi
                </label>
                <select
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="form-select"
                >
                  <option value="">Pilih profesi</option>
                  {professionOptions.map(prof => (
                    <option key={prof} value={prof}>{prof}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>
                  <Award size={16} />
                  Spesialisasi
                </label>
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="form-select"
                >
                  <option value="">Pilih spesialisasi</option>
                  {specializationOptions.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>
                <Code size={16} />
                Keahlian (pisahkan dengan koma)
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Tambal Gigi, Cabut Gigi, Rontgen Gigi"
              />
              <small style={{ color: '#6B7280', fontSize: '0.8rem' }}>
                Contoh: Tambal Gigi, Cabut Gigi, Rontgen Gigi, Konsultasi Pasien
              </small>
            </div>

            <div className="form-group">
              <label>
                <Award size={16} />
                Sertifikasi (pisahkan dengan koma)
              </label>
              <input
                type="text"
                name="certification"
                value={formData.certification}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="STR, SIP, BLS, ACLS"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <Briefcase size={16} />
                  Pengalaman
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="form-select"
                >
                  <option value="">Pilih pengalaman</option>
                  {experienceOptions.map(exp => (
                    <option key={exp} value={exp}>{exp}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>
                  <MapPin size={16} />
                  Lokasi
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="form-select"
                >
                  <option value="">Pilih lokasi</option>
                  {locationOptions.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <GraduationCap size={16} />
                  Pendidikan
                </label>
                <select
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="form-select"
                >
                  <option value="">Pilih pendidikan</option>
                  {educationOptions.map(edu => (
                    <option key={edu} value={edu}>{edu}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>
                  <Award size={16} />
                  Nomor STR/SIP
                </label>
                <input
                  type="text"
                  name="license_number"
                  value={formData.license_number}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="STR-12345"
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                <LinkIcon size={16} />
                Portfolio / Website
              </label>
              <input
                type="url"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="https://portfolio.com"
              />
            </div>

            {isEditing && (
              <div className="profile-form-actions">
                <Button 
                  type="submit" 
                  variant="primary"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader size={18} className="spinning" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Simpan Perubahan
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Batal
                </Button>
              </div>
            )}

            {!isEditing && (
              <div className="profile-view-only">
                <p className="profile-view-hint">
                  Klik tombol Edit Profil untuk mengubah informasi
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </motion.div>
  );
}

export default Profile;