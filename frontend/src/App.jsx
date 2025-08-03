import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

export default function App() {
  return (
    <Router>
      <nav style={{ display: 'flex', gap: '1rem', padding: '1rem' }}>
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign Up</Link>
      </nav>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Router>
  );
}