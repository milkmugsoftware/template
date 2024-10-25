import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import ForgotPasswordModal from '../components/ForgotPasswordModal';

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
    <Paper
      elevation={3}
      sx={{
        padding: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: 400,
        margin: 'auto',
        marginTop: 8,
      }}
    >
      <Typography component="h1" variant="h5">
        {t('signIn')}
      </Typography>
      <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1, width: '100%' }}>
        <TextField
          margin="normal"
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
          margin="normal"
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
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          {t('signIn')}
        </Button>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Link component="button" variant="body2" onClick={handleOpenModal}>
            {t('forgotPassword')}
          </Link>
          <Link component={RouterLink} to="/register" variant="body2">
            {t('dontHaveAccount')}
          </Link>
        </Box>
      </Box>
      <ForgotPasswordModal open={isModalOpen} onClose={handleCloseModal} />
    </Paper>
  );
};

export default Login;