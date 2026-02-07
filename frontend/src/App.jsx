
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CropDetails from './pages/CropDetails';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { LanguageProvider } from './i18n.jsx';

const App = () => {
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem('agri_auth');
    return saved ? JSON.parse(saved) : { user: null, token: null, isAuthenticated: false };
  });

  useEffect(() => {
    localStorage.setItem('agri_auth', JSON.stringify(auth));
  }, [auth]);

  const login = (user, token) => {
    setAuth({ user, token, isAuthenticated: true });
  };

  const logout = () => {
    setAuth({ user: null, token: null, isAuthenticated: false });
    localStorage.removeItem('agri_auth');
  };

  return (
    <LanguageProvider>
      <HashRouter>
        <div className="min-h-screen flex flex-col">
          {auth.isAuthenticated && <Navbar user={auth.user} onLogout={logout} />}
          <main className="flex-grow">
            <Routes>
              <Route 
                path="/login" 
                element={!auth.isAuthenticated ? <Login onLogin={login} /> : <Navigate to="/" />} 
              />
              <Route 
                path="/register" 
                element={!auth.isAuthenticated ? <Register onLogin={login} /> : <Navigate to="/" />} 
              />
              <Route 
                path="/" 
                element={
                  <ProtectedRoute isAuthenticated={auth.isAuthenticated}>
                    <Dashboard user={auth.user} />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/crop/:id" 
                element={
                  <ProtectedRoute isAuthenticated={auth.isAuthenticated}>
                    <CropDetails />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </LanguageProvider>
  );
};

export default App;
