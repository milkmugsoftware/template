import { useState } from 'react';
import { Box, Typography, Paper, Chip, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const WhaleAlert = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: `${theme.palette.background.paper}80`,
}));

const GlassButton = styled(ToggleButton)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.3)',
  backdropFilter: 'blur(5px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: theme.shape.borderRadius,
  color: theme.palette.text.primary,
  padding: '8px 16px',
  fontSize: '1rem',
  fontWeight: 'bold',
  '&.Mui-selected': {
    background: 'rgba(0, 0, 0, 0.7)',
    color: theme.palette.common.white,
  },
}));

const WhaleTracking = () => {
  const [selectedCoin, setSelectedCoin] = useState('ALL');

  const whaleAlerts = [
    { amount: '1,000', coin: 'BTC', from: '1A1zP...', to: '3J98t...', time: '5 minutes ago' },
    { amount: '10,000', coin: 'ETH', from: '0x742d...', to: '0x8929...', time: '15 minutes ago' },
    { amount: '5,000,000', coin: 'XRP', from: 'rG1qa...', to: 'rP5s9...', time: '1 hour ago' },
  ];

  const getExplorerUrl = (address: string, coin: string) => {
    if (coin === 'BTC') {
      return `https://www.blockchain.com/btc/address/${address}`;
    } else if (coin === 'ETH') {
      return `https://etherscan.io/address/${address}`;
    }
    return '#';
  };

  const getChipColor = (coin: string) => {
    switch (coin) {
      case 'BTC':
        return '#ff9800';
      case 'ETH':
        return '#3c3c3d';
      default:
        return 'primary';
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontFamily: 'Lexend Mega, sans-serif' }}>
          Recent Whale Alerts
        </Typography>
        <ToggleButtonGroup
          value={selectedCoin}
          exclusive
          onChange={(_, newCoin) => setSelectedCoin(newCoin)}
          aria-label="coin selection"
        >
          <GlassButton value="ALL" aria-label="ALL">
            ALL
          </GlassButton>
          <GlassButton value="BTC" aria-label="BTC">
            BTC
          </GlassButton>
          <GlassButton value="ETH" aria-label="ETH">
            ETH
          </GlassButton>
        </ToggleButtonGroup>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {whaleAlerts
          .filter(alert => selectedCoin === 'ALL' || alert.coin === selectedCoin)
          .map((alert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <WhaleAlert>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip 
                        label={`${alert.amount} ${alert.coin}`} 
                        sx={{ 
                          fontWeight: 'bold', 
                          color: 'white', 
                          backgroundColor: getChipColor(alert.coin),
                          padding: '8px 12px',
                          fontSize: '1rem'
                        }} 
                      />
                      <Typography variant="h6" color="primary">{alert.coin}</Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {alert.time}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body1" sx={{ wordBreak: 'break-all', fontSize: '1rem' }}>
                      From: <a href={getExplorerUrl(alert.from, alert.coin)} target="_blank" rel="noopener noreferrer">{alert.from}</a>
                    </Typography>
                    <Typography variant="body1" sx={{ wordBreak: 'break-all', fontSize: '1rem' }}>
                      To: <a href={getExplorerUrl(alert.to, alert.coin)} target="_blank" rel="noopener noreferrer">{alert.to}</a>
                    </Typography>
                  </Box>
                </Box>
              </WhaleAlert>
            </motion.div>
          ))}
      </Box>
    </>
  );
};

export default WhaleTracking;