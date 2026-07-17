import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Zap, Shield, Users } from 'lucide-react';
import Button from '../components/common/Button';

function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <motion.section 
        className="hero"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="hero-content">
          <h1 className="hero-title">
            Temukan Pekerjaan <br />
            <span className="hero-highlight">Impianmu</span> dengan Mudah
          </h1>
          <p className="hero-subtitle">
            Jalur Langit membantu kamu menemukan lowongan yang sesuai dengan skill dan pengalamanmu, 
            serta mengirimkan lamaran secara otomatis ke recruiter.
          </p>
          <div className="hero-actions">
            <Link to="/jobs">
              <Button variant="primary" size="large">
                Cari Kerja Sekarang
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="large">
                Daftar Gratis
              </Button>
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-illustration">
            <Briefcase size={120} color="#7C3AED" />
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">Kenapa Memilih Jalur Langit?</h2>
        <div className="features-grid">
          <motion.div 
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="feature-icon"><Zap size={32} /></div>
            <h3>Smart Matching</h3>
            <p>Kami cocokkan lowongan dengan skill dan pengalamanmu secara otomatis.</p>
          </motion.div>
          <motion.div 
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="feature-icon"><Shield size={32} /></div>
            <h3>Auto-Apply</h3>
            <p>Lamaran dikirim langsung ke email recruiter tanpa perantara.</p>
          </motion.div>
          <motion.div 
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="feature-icon"><Users size={32} /></div>
            <h3>Terpercaya</h3>
            <p>Lowongan dari sumber terpercaya yang dipublikasikan di media sosial.</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Home;
