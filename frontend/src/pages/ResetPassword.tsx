import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError(t('passwordsDoNotMatch'));
      return;
    }

    if (password.length < 8) {
      setError(t('passwordTooShort'));
      return;
    }

    try {
      await axios.post('/api/auth/reset-password', {
        token,
        new_password: password
      });
      setSuccess(t('passwordResetSuccess'));
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || t('passwordResetError'));
      console.error('Password reset error:', err);
    }
  };

  if (!token) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">{t('invalidResetLink')}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'center',
        px: { xs: 2, sm: 3 },
        py: { xs: 2, sm: 4 },
      }}
    >
      <Box
        component={Paper}
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: 'sm',
          p: { xs: 2, sm: 3 },
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography component="h1" variant="h5" align="center">
          {t('resetPassword')}
        </Typography>
        
        <Box 
          component="form" 
          onSubmit={handleSubmit} 
          noValidate 
          sx={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <TextField
            required
            fullWidth
            name="password"
            label={t('newPassword')}
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            required
            fullWidth
            name="confirmPassword"
            label={t('confirmPassword')}
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="success.main" variant="body2">
              {success}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              height: 46,
              fontWeight: 600,
            }}
          >
            {t('resetPassword')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ResetPassword; 