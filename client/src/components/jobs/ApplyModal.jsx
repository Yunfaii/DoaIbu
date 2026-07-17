import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, Mail, Briefcase } from 'lucide-react';
import Button from '../common/Button';

function ApplyModal({ result, onClose }) {
  const { message, details } = result;

  return (
    <AnimatePresence>
      <motion.div 
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="modal-content"
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>

          <div className="modal-success-icon">
            <CheckCircle size={64} color="#10B981" />
          </div>

          <h2 className="modal-title">🎉 Lamaran Terkirim!</h2>
          <p className="modal-message">{message}</p>

          <div className="modal-details">
            <div className="modal-detail-row">
              <Briefcase size={18} />
              <span><strong>{details.job}</strong> at {details.company}</span>
            </div>
            <div className="modal-detail-row">
              <Mail size={18} />
              <span>Email recruiter: <strong>{details.email}</strong></span>
            </div>
            <div className="modal-detail-row">
              <CheckCircle size={18} color="#10B981" />
              <span>Status: <strong style={{ color: '#10B981' }}>{details.status}</strong></span>
            </div>
          </div>

          <div className="modal-actions">
            <Button variant="primary" onClick={onClose}>
              Lihat Lowongan Lain
            </Button>
          </div>

          <p className="modal-footer">
            Lamaran akan diproses dalam 1-2 hari kerja
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ApplyModal;
