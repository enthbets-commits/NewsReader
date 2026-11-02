import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('newsreader_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // Keep the logged-in user after refreshing the page
  useEffect(() => {
    if (user) {
      localStorage.setItem('newsreader_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('newsreader_user');
    }
  }, [user]);

  // Login function
  const login = (username, password, role = 'regular') => {

    if (!username.trim() || !password.trim()) {
      throw new Error('Username and password are required');
    }

    const newUser = {
      username: username.trim(),
      role: role === 'admin' ? 'admin' : 'regular'
    };

    setUser(newUser);
  };

  // Logout function
  const logout = () => {
    setUser(null);
  };

  // Check whether someone is logged in
  const isAuthenticated = () => {
    return user !== null;
  };

  // Check whether the current user is an admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook
export const useAuth = () => {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};