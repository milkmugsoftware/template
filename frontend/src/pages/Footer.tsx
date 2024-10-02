import { Box, Container, Typography, Link, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(6, 0),
}));

const Footer = () => {
  return (
    <FooterContainer>
      <Container maxWidth="lg">
        <Divider sx={{ mb: 4 }} />
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} Zenalyx. All rights reserved.
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
          <Link color="inherit" href="/privacy">Privacy Policy</Link>
          {' | '}
          <Link color="inherit" href="/terms">Terms of Service</Link>
        </Typography>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
