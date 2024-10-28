import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Paper, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        p: { xs: 2, sm: 3 },
        overflowY: 'auto',
        height: '100%',
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
          my: 'auto',
          position: 'relative',
        }}
      >
        <IconButton
          onClick={onClose}
          color="error"
          size="small"
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        <Typography id="forgot-password-title" variant="h6" component="h2">
          {t('resetPassword')}
        </Typography>
        
        <Typography id="forgot-password-description" variant="body2">
          {t('enterEmailForReset')}
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
            >
              {message}
            </Typography>
          )}
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
          >
            {t('sendResetLink')}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ForgotPasswordModal;
