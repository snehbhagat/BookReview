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
  IconButton,
  Link as MuiLink,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { Link, useNavigate } from 'react-router-dom';

const SIGNUP_URL = 'http://localhost:5000/auth/signup';

export default function SignupPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await fetch(SIGNUP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess('Signup successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError(data.message || 'Signup failed');
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
            Create Account
          </Typography>
          <form onSubmit={handleSignup}>
            <TextField
              label="Username"
              required
              fullWidth
              margin="normal"
              value={username}
              onChange={e => setUsername(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonAddIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
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
            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} type="submit">
              Sign Up
            </Button>
          </form>
          <Box mt={2} display="flex" justifyContent="center">
            <MuiLink component={Link} to="/login" underline="hover">
              Have an account? Log In
            </MuiLink>
          </Box>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        </CardContent>
      </Card>
    </Box>
  );
}