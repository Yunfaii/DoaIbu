import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, Mail, Briefcase, MapPin, Code, 
  GraduationCap, Link as LinkIcon, Save, 
  Loader, CheckCircle, AlertCircle, Camera, Edit2
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

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: '',
    experience: '',
    location: '',
    portfolio: '',
    education: ''
  });

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(API_URL);
        const data = response.data;
        setProfile(data);
        setFormData({
          name: data.name || '',
          email: data.email || '',
          skills: data.skills ? data.skills.join(', ') : '',
          experience: data.experience || '',
          location: data.location || '',
          portfolio: data.portfolio || '',
          education: data.education || ''
        });
      } catch (err) {
        setError('Failed to load profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

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
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
      };
      
      const response = await axios.put(API_URL, payload);
      setProfile(response.data.profile);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Update auth context
      const updatedUser = { ...user, ...payload };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: profile?.name || '',
      email: profile?.email || '',
      skills: profile?.skills ? profile.skills.join(', ') : '',
      experience: profile?.experience || '',
      location: profile?.location || '',
      portfolio: profile?.portfolio || '',
      education: profile?.education || ''
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
        <p>Loading profile...</p>
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
        <h1>👤 Profil Saya</h1>
        <p>Kelola informasi pribadi dan preferensi pekerjaanmu</p>
      </div>

      <div className="profile-grid">
        {/* Left Column - Profile Card */}
        <div className="profile-card">
          <div className="profile-avatar">
            <div className="avatar-circle">
              <span className="avatar-letter">
                {profile?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <button className="avatar-edit-btn">
              <Camera size={16} />
            </button>
          </div>
          <h2 className="profile-name">{profile?.name || 'User'}</h2>
          <p className="profile-email">{profile?.email}</p>
          
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-number">{profile?.skills?.length || 0}</span>
              <span className="stat-label">Skills</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">{profile?.experience || '0'}</span>
              <span className="stat-label">Experience</span>
            </div>
          </div>

          <button onClick={handleLogout} className="profile-logout-btn">
            Logout
          </button>
        </div>

        {/* Right Column - Edit Form */}
        <div className="profile-form-card">
          <div className="profile-form-header">
            <h3>{isEditing ? 'Edit Profil' : 'Informasi Profil'}</h3>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="profile-edit-btn">
                <Edit2 size={18} />
                Edit Profile
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
                  onChange={handleChange}
                  disabled={true}
                  placeholder="Email"
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                <Code size={16} />
                Skills (pisahkan dengan koma)
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="React, JavaScript, Node.js, CSS"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <Briefcase size={16} />
                  Pengalaman
                </label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="2 years, 3 years, etc."
                />
              </div>
              <div className="form-group">
                <label>
                  <MapPin size={16} />
                  Lokasi
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Jakarta, Bandung, Remote"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <GraduationCap size={16} />
                  Pendidikan
                </label>
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="S1 Computer Science, etc."
                />
              </div>
              <div className="form-group">
                <label>
                  <LinkIcon size={16} />
                  Portfolio
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
                      Saving...
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
                  💡 Klik tombol "Edit Profile" untuk mengubah informasi
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
