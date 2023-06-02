import { createContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwt_decode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        localStorage.removeItem('uid');
      } else {
        setLoggedIn(true);
      }
    }
  }, []);

  const login = (token, uid) => {
    localStorage.setItem('token', token);
    localStorage.setItem('uid', uid);
    setLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('uid');
    setLoggedIn(false);
  };

  const values = {
    loggedIn,
    login,
    logout,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
