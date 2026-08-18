import React, { useState } from 'react';
import {
  Box, Paper, Typography, TextField, Button,
  Grid, Link, Alert, Divider
} from '@mui/material';
import { Google, Facebook } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(formData);
      const userRole = response.data.user.role;
      navigate(userRole === 'admin' ? '/admin/dashboard' :
              userRole === 'vendor' ? '/vendor/dashboard' : '/user/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      navigate('/user/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || `${provider} login failed`);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Paper sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Link href="#" variant="body2">
            Forgot password?
          </Link>
        </Box>

        <Divider sx={{ my: 2 }}>OR</Divider>

        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Google />}
              onClick={() => handleSocialLogin('google')}
            >
              Google
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Facebook />}
              onClick={() => handleSocialLogin('facebook')}
            >
              Facebook
            </Button>
          </Grid>
        </Grid>

        <Typography align="center" sx={{ mt: 2 }}>
          Don't have an account? <Link href="/register">Register</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;