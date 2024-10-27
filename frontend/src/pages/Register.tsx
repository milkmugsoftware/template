import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Link } from '@mui/material';
import axios from 'axios';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SocialLoginButtons from '../components/SocialLoginButtons';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('/api/auth/register', { email, username, password });
      setSuccess(t('registrationSuccess'));
      // Auto-login after successful registration
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || t('registrationFailed'));
      console.error('Registration error:', err);
    }
  };

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
          {t('signUp')}
        </Typography>
        
        <Box 
          component="form" 
          onSubmit={handleRegister} 
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
            id="email"
            label={t('emailAddress')}
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            required
            fullWidth
            id="username"
            label={t('username')}
            name="username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            required
            fullWidth
            name="password"
            label={t('password')}
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            {t('signUp')}
          </Button>

          <SocialLoginButtons />

          <Box sx={{ textAlign: 'center', mt: 1 }}>
            <Link component={RouterLink} to="/login" variant="body2">
              {t('alreadyHaveAccount')}
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
