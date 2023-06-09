import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import ProtectedRoute from './components/ProtectedRoute.js';

import Navbar from './Navbar.js';
import Home from './pages/Home.js';
import Gallery from './pages/Gallery.js';
import Blog from './pages/Blog.js';
import Map from './pages/Map.js';
import Login from './pages/Login.js';
import Upload from './pages/Upload.js';
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
              <Route path="/gallery" exact element={<Gallery />} />
              <Route path="/blog" exact element={<Blog />} />
              <Route path="/map" exact element={<Map />} />
              <Route path="/login" exact element={<Login />} />
              <Route path="/upload" exact element={<ProtectedRoute><Upload /></ProtectedRoute>} />
              <Route path="/account" exact element={<ProtectedRoute><Account /></ProtectedRoute>} />
            </Routes>
          </div>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
