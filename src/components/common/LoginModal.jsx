import React, { useState } from 'react';
import {
  Dialog, DialogContent, Box, Typography, IconButton,
  TextField, Button, InputAdornment
} from '@mui/material';
import { Close, Home, ExpandLess } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

const LoginModal = ({ open, onClose }) => {
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    setError('');

    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      await login({ email: `${phone}@phone.local`, password: phone });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPhone('');
    setError('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, overflow: 'visible' } }}
    >
      <IconButton
        onClick={handleClose}
        sx={{ position: 'absolute', top: 12, right: 12, zIndex: 1 }}
      >
        <Close fontSize="small" />
      </IconButton>

      <DialogContent sx={{ p: 4, textAlign: 'center' }}>
        {/* Illustration placeholder */}
        <Box
          sx={{
            height: 110,
            borderRadius: 2,
            mb: 2,
            background: 'linear-gradient(135deg, #ede7f6 0%, #f3e5f5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            🏘️ Housing illustration
          </Typography>
        </Box>

        {/* Logo badge */}
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: '10px',
            bgcolor: '#ffb300',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mt: -6,
            mb: 2,
            boxShadow: 3,
            position: 'relative',
            zIndex: 2,
          }}
        >
          <ExpandLess sx={{ color: '#3b2f6e', fontSize: 26 }} />
        </Box>

        <Typography variant="h6" fontWeight="700" gutterBottom>
          Log in or sign up to Housing
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, mb: 3 }}>
          <Typography variant="body2" color="text.secondary">Buy</Typography>
          <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled', alignSelf: 'center' }} />
          <Typography variant="body2" color="text.secondary">Rent</Typography>
          <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled', alignSelf: 'center' }} />
          <Typography variant="body2" color="text.secondary">Sell</Typography>
        </Box>

        <TextField
          fullWidth
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
          inputProps={{ maxLength: 10 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Typography variant="body1" sx={{ borderRight: '1px solid #ddd', pr: 1.5, color: 'text.primary' }}>
                  +91
                </Typography>
              </InputAdornment>
            ),
          }}
          sx={{
            mb: error ? 1 : 3,
            '& .MuiOutlinedInput-root': { borderRadius: 2, py: 0.5 },
          }}
        />

        {error && (
          <Typography variant="caption" color="error" sx={{ display: 'block', textAlign: 'left', mb: 2 }}>
            {error}
          </Typography>
        )}

        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleContinue}
          disabled={loading}
          sx={{
            bgcolor: '#5a4a9e',
            borderRadius: 2,
            py: 1.3,
            fontWeight: 700,
            fontSize: '1rem',
            textTransform: 'none',
            '&:hover': { bgcolor: '#4a3d85' },
          }}
        >
          {loading ? 'Please wait...' : 'Continue'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;