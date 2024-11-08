import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import ForgotPasswordModal from '../components/auth/ForgotPasswordModal';
import SocialLoginButtons from '../components/auth/SocialLoginButtons';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(t('loginFailed'));
      console.error('Login error:', err);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
          {t('signIn')}
        </Typography>
        
        <Box 
          component="form" 
          onSubmit={handleLogin} 
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
            name="password"
            label={t('password')}
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Typography color="error" variant="body2">
              {error}
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
            {t('signIn')}
          </Button>

          <SocialLoginButtons />

          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 2 },
              alignItems: { xs: 'stretch', sm: 'center' },
              mt: 1,
            }}
          >
            <Link 
              component="button" 
              variant="body2" 
              onClick={handleOpenModal}
              sx={{ textAlign: { xs: 'center', sm: 'left' } }}
            >
              {t('forgotPassword')}
            </Link>
            <Link 
              component={RouterLink} 
              to="/register" 
              variant="body2"
              sx={{ textAlign: { xs: 'center', sm: 'right' } }}
            >
              {t('dontHaveAccount')}
            </Link>
          </Box>
        </Box>
      </Box>
      <ForgotPasswordModal open={isModalOpen} onClose={handleCloseModal} />
    </Box>
  );
};

export default Login;
