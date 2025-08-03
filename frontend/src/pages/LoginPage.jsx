import React, { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  InputAdornment,
  Link as MuiLink,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import LoginIcon from '@mui/icons-material/Login';
import { Link, useNavigate } from 'react-router-dom';

const LOGIN_URL = 'http://localhost:5000/auth/login';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => navigate('/home'), 1000);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'primary.light', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Card sx={{ minWidth: 350, maxWidth: 400, boxShadow: 6, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom color="primary">
            Log In
          </Typography>
          <form onSubmit={handleLogin}>
            <TextField
              label="Email"
              type="email"
              required
              fullWidth
              margin="normal"
              value={email}
              onChange={e => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Password"
              type="password"
              required
              fullWidth
              margin="normal"
              value={password}
              onChange={e => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} startIcon={<LoginIcon />}>
              Log In
            </Button>
          </form>
          <Box mt={2} display="flex" justifyContent="center">
            <MuiLink component={Link} to="/signup" underline="hover">
              Don&apos;t have an account? Sign Up
            </MuiLink>
          </Box>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        </CardContent>
      </Card>
    </Box>
  );
}