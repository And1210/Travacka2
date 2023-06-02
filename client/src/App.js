import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import ProtectedRoute from './components/ProtectedRoute.js';

import Navbar from './Navbar.js';
import Home from './pages/Home.js';
import Login from './pages/Login.js';
import Account from './pages/Account.js';

import './App.css';

function App() {
// <Route path="/gallery" element={<Gallery />} />
// <Route path="/map" element={<Map />} />
// <Route path="/daybyday" element={<DayByDay />} />
// <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
// <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
// <Route path="/login" element={<Login />} />
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <div>
            <Navbar />
            <Routes>
              <Route path="/" exact element={<Home />} />
              <Route path="/login" exact element={<Login />} />
              <Route path="/account" exact element={<Account />} />
            </Routes>
          </div>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
