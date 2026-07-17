import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, User, LogOut, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <Briefcase size={28} color="#7C3AED" />
          <span>Jalur Langit</span>
        </Link>

        <div className="navbar-links">
          <Link to="/jobs" className="nav-link">Lowongan</Link>
          
          {user ? (
            <>
              <Link to="/profile" className="nav-link">
                <User size={18} />
                <span>{user.name}</span>
              </Link>
              <button onClick={handleLogout} className="nav-link nav-logout">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                <LogIn size={18} />
                <span>Login</span>
              </Link>
              <Link to="/register" className="nav-link nav-register">
                <UserPlus size={18} />
                <span>Daftar</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
