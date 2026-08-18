import React, { useState } from 'react';
import {
  Box, Paper, Typography, TextField, Button,
  Grid, Link, Alert, Stepper, Step, StepLabel,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const steps = ['Account Info', 'Verification', 'Complete'];

const Register = () => {
  const navigate = useNavigate();
  const { register, verifyOTP } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    otp: ''
  });

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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await register(formData);
      setActiveStep(1);
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError('');
    setLoading(true);

    try {
      await verifyOTP({ email: formData.email, otp: formData.otp });
      setActiveStep(2);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Register as</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  label="Register as"
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="vendor">Vendor (Property Dealer/Builder)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 2 }}>
              We've sent a verification code to your email: {formData.email}
            </Alert>
            <TextField
              fullWidth
              label="OTP Code"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              placeholder="Enter 6-digit OTP"
              required
            />
            <Button
              fullWidth
              variant="text"
              sx={{ mt: 1 }}
            >
              Resend OTP
            </Button>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" color="success.main" gutterBottom>
              ✓ Registration Complete!
            </Typography>
            <Typography>
              Your account has been verified successfully.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Redirecting to login...
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Paper sx={{ p: 4, maxWidth: 450, width: '100%' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={activeStep === 0 ? handleSubmit : handleVerify}>
          {renderStepContent(activeStep)}

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? 'Processing...' :
             activeStep === 0 ? 'Register' :
             activeStep === 1 ? 'Verify OTP' : 'Continue'}
          </Button>
        </form>

        <Typography align="center" sx={{ mt: 2 }}>
          Already have an account? <Link href="/login">Login</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Register;