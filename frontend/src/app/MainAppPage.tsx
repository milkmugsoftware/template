import React, { useState } from 'react';
import { Box, Container, Typography, Paper, Button, TextField, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { MonitorHeart, Analytics, AccountTree, Notifications, Search } from '@mui/icons-material';
import GradientBackground from '../components/GradientBackground';

const DashboardContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const DashboardCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const AnimatedButton = styled(motion(Button))({
  marginTop: '16px',
}) as typeof Button & React.ComponentType<any>;

const SearchBar = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius * 2,
    '& fieldset': {
      borderColor: theme.palette.text.primary,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const WhaleAlert = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: `${theme.palette.background.paper}80`,
}));

const MainAppPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const dashboardItems = [
    { title: 'Whale Tracking', icon: <MonitorHeart />, description: 'Monitor large-scale crypto movements' },
    { title: 'Analytics', icon: <Analytics />, description: 'In-depth market analysis and trends' },
    { title: 'Multi-chain', icon: <AccountTree />, description: 'Track across various blockchain networks' },
    { title: 'Alerts', icon: <Notifications />, description: 'Customizable notifications for whale activities' },
  ];

  const whaleAlerts = [
    { amount: '1,000 BTC', from: '1A1zP...', to: '3J98t...', time: '5 minutes ago' },
    { amount: '10,000 ETH', from: '0x742d...', to: '0x8929...', time: '15 minutes ago' },
    { amount: '5,000,000 XRP', from: 'rG1qa...', to: 'rP5s9...', time: '1 hour ago' },
  ];

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
      <GradientBackground />
      <DashboardContainer maxWidth="lg">
        <Typography variant="h2" gutterBottom sx={{ fontFamily: 'Lexend Mega, sans-serif', fontWeight: 800 }}>
          Zenalyx Dashboard
        </Typography>
        <SearchBar
          fullWidth
          variant="outlined"
          placeholder="Search for wallet addresses, transactions, or tokens..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <Search color="action" sx={{ mr: 1 }} />,
          }}
        />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, mt: 4 }}>
          {dashboardItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{ flex: '1 1 calc(25% - 16px)', minWidth: '200px' }}
            >
              <DashboardCard>
                {item.icon}
                <Typography variant="h6" component="h3" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
                <AnimatedButton
                  variant="outlined"
                  color="primary"
                  fullWidth
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore
                </AnimatedButton>
              </DashboardCard>
            </motion.div>
          ))}
        </Box>
        <Typography variant="h4" sx={{ mt: 6, mb: 3, fontFamily: 'Lexend Mega, sans-serif' }}>
          Recent Whale Alerts
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {whaleAlerts.map((alert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <WhaleAlert>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Chip label={alert.amount} color="primary" sx={{ fontWeight: 'bold' }} />
                  <Typography variant="body2">
                    From: {alert.from} → To: {alert.to}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {alert.time}
                  </Typography>
                </Box>
              </WhaleAlert>
            </motion.div>
          ))}
        </Box>
      </DashboardContainer>
    </Box>
  );
};

export default MainAppPage;