import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useArticles } from '../context/ArticlesContext';
import { useAuth } from '../context/AuthContext';

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const { getUserSavedArticles } = useArticles();

  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  const savedArticles = getUserSavedArticles();
  const authenticated = isAuthenticated();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav>
      <div className="nav-container">

        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>

          <h1 className="nav-brand">NewsReader</h1>

          <div className="nav-links">

            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
              Home
            </Link>

            <Link to="/search" className={`nav-link ${location.pathname === '/search' ? 'active' : ''}`}>
              Search
            </Link>

            <Link to="/saved" className={`nav-link ${location.pathname === '/saved' ? 'active' : ''}`}>
              Saved Articles ({savedArticles.length})
            </Link>

            {authenticated && isAdmin() && (
              <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>
                Admin
              </Link>
            )}

          </div>
        </div>

        <div className="nav-user">

          {authenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>

              <span>Welcome, {user.username}!</span>

              <button
                onClick={handleLogout}
                style={{
                  padding: '8px 14px',
                  border: 'none',
                  borderRadius: '5px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>

            </div>
          ) : (
            <Link to="/login" className="nav-link">
              Login
            </Link>
          )}

        </div>

      </div>
    </nav>
  );
}

export default Navigation;