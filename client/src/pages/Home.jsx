import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Shield, Users } from 'lucide-react';
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
            Dengan <br />
            <span className="hero-highlight">Jalur Langit</span> diiringi  
            <span className="hero-highlight"> Doa Ibu</span>, <br /> semoga kamu dapat kerja.
          </h1>
          <p className="hero-subtitle">
            Jalur Langit dapat membantu kamu sebagai lulusan jurusan kesehatan mencari peluang pekerjaan yang cocok.
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
            <img 
              src="/src/assets/logo.png" 
              alt="Jalur Langit Logo"
              style={{ width: '120px', height: '120px', objectFit: 'contain' }}
            />
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
            <p>Kami cocokkan lowongan dengan spesialisasi dan pengalaman kamu.</p>
          </motion.div>
          <motion.div 
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="feature-icon"><Shield size={32} /></div>
            <h3>Auto-Apply</h3>
            <p>Lamaran dikirim langsung ke email rumah sakit tanpa perantara.</p>
          </motion.div>
          <motion.div 
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="feature-icon"><Users size={32} /></div>
            <h3>Terpercaya</h3>
            <p>Lowongan dari sumber terpercaya yang bisa bikin kamu cepat kerja.</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Home;