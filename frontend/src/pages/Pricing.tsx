import { Box, Typography, Button, Container, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import GradientBackground from '../components/GradientBackground';
import CheckIcon from '@mui/icons-material/Check';

const PricingSection = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  padding: theme.spacing(8, 2),
}));

const PricingCard = styled(motion.div)(({ theme }) => ({
  backgroundColor: `${theme.palette.background.paper}80`,
  border: `1px solid ${theme.palette.text.primary}`,
  borderRadius: 0,
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  height: '100%',
}));

const FeatureItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  color: theme.palette.text.primary,
}));

const Pricing = () => {

  const plans = [
    {
      title: 'Standard',
      price: '$10',
      features: [
        'Real-time whale transaction alerts',
        'Basic analytics dashboard',
        'Single blockchain support',
        'Daily market insights',
        '24/7 customer support',
      ],
    },
    {
      title: 'Pro',
      price: '$99',
      features: [
        'All Standard features',
        'Advanced predictive analytics',
        'Multi-chain tracking and analysis',
        'Custom alert configurations',
        'API access for integration',
        'Priority customer support',
        'Exclusive webinars and reports',
      ],
    },
  ];

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
      <GradientBackground />
      <PricingSection>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            gutterBottom
            sx={{
              fontFamily: 'Lexend Mega, sans-serif',
              fontWeight: 800,
              mb: 6,
              fontSize: { xs: '2rem', sm: '3rem', md: '3.75rem' },
            }}
          >
            Choose Your Plan
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'center', 
            alignItems: 'center',
            gap: 4 
          }}>
            {plans.map((plan, index) => (
              <PricingCard
                key={plan.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                sx={{ 
                  flex: { xs: '1', md: '0 1 400px' }, 
                  width: '100%',
                  maxWidth: '400px', 
                  height: { xs: 'auto', md: '600px' },
                  mb: { xs: 4, md: 0 }
                }}
              >
                <Typography variant="h4" component="h3" gutterBottom>
                  {plan.title}
                </Typography>
                <Typography variant="h3" color="primary" gutterBottom>
                  {plan.price}
                  <Typography variant="subtitle1" component="span">
                    /month
                  </Typography>
                </Typography>
                <Divider sx={{ width: '100%', my: 3, borderColor: 'text.primary' }} />
                <Box sx={{ mb: 4, width: '100%', flexGrow: 1, overflowY: 'auto' }}>
                  {plan.features.map((feature, fIndex) => (
                    <FeatureItem key={fIndex}>
                      <CheckIcon color="primary" sx={{ mr: 2, flexShrink: 0 }} />
                      <Typography variant="body1">{feature}</Typography>
                    </FeatureItem>
                  ))}
                </Box>
                <Box sx={{ width: '100%' }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    fullWidth
                    disabled
                    sx={{ borderColor: 'text.primary', color: 'text.primary' }}
                  >
                    Coming Soon
                  </Button>
                </Box>
              </PricingCard>
            ))}
          </Box>
        </Container>
      </PricingSection>
    </Box>
  );
};

export default Pricing;
