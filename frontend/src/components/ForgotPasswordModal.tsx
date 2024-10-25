import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

interface ForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ open, onClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');
    setIsError(false);

    try {
      await axios.post('/api/auth/reset-password', { email });
      setMessage(t('resetLinkSent'));
    } catch (error) {
      setIsError(true);
      setMessage(t('resetLinkError'));
      console.error('Password reset error:', error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="forgot-password-title"
      aria-describedby="forgot-password-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(5px)',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            maxWidth: 400,
            width: '100%',
          }}
        >
          <Typography id="forgot-password-title" variant="h6" component="h2" gutterBottom>
            {t('resetPassword')}
          </Typography>
          <Typography id="forgot-password-description" variant="body2" gutterBottom>
            {t('enterEmailForReset')}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
            {message && (
              <Typography 
                color={isError ? 'error' : 'success'} 
                variant="body2" 
                sx={{ mt: 1 }}
              >
                {message}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {t('sendResetLink')}
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={onClose}
              sx={{ mt: 1 }}
            >
              {t('close')}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Modal>
  );
};

export default ForgotPasswordModal;
