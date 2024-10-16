import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Link } from '@mui/material';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      const response = await axios.post('/api/auth/register', { email, username, password });
      console.log('Registration successful:', response.data);
    } catch (err) {
      setError(t('registrationFailed'));
      console.error('Registration error:', err);
    }
  };

  return (
    <Box
      component={Paper}
      elevation={3}
      sx={{
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '400px',
        margin: 'auto',
        marginTop: '64px',
      }}
    >
      <Typography component="h1" variant="h5">
        {t('signUp')}
      </Typography>
      <Box component="form" onSubmit={handleRegister} noValidate sx={{ mt: 1 }}>
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
          id="username"
          label={t('username')}
          name="username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          margin="normal"
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
          {t('signUp')}
        </Button>
        <Box sx={{ textAlign: 'right' }}>
          <Link component={RouterLink} to="/login" variant="body2">
            {t('alreadyHaveAccount')}
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
