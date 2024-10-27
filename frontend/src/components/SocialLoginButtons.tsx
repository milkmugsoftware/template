import { Box, Button, Divider, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useTranslation } from 'react-i18next';

const SocialLoginButtons = () => {
  const { t } = useTranslation();

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/login/google';
  };

  const handleFacebookLogin = () => {
    window.location.href = '/api/auth/login/facebook';
  };

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
        <Divider sx={{ flex: 1 }} />
        <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
          {t('orContinueWith')}
        </Typography>
        <Divider sx={{ flex: 1 }} />
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleLogin}
          sx={{
            borderColor: 'divider',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'action.hover',
            },
          }}
        >
          {t('continueWithGoogle')}
        </Button>
        
        <Button
          fullWidth
          variant="outlined"
          startIcon={<FacebookIcon />}
          onClick={handleFacebookLogin}
          sx={{
            borderColor: 'divider',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'action.hover',
            },
          }}
        >
          {t('continueWithFacebook')}
        </Button>
      </Box>
    </Box>
  );
};

export default SocialLoginButtons;
