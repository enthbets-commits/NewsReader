import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  // Redirect users who are not logged in
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Allow authenticated users to continue
  return children;
}

export default ProtectedRoute;