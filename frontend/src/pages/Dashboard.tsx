import React from 'react';
import { Typography, Button, Box, Paper } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  const accountAge = new Date(user.created_at).toLocaleDateString();

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Hi, {user.username}!
        </Typography>
        <Typography variant="body1" gutterBottom>
          Account created on: {accountAge}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Credits: {user.credits}
        </Typography>
        <Button variant="contained" color="primary" onClick={logout} sx={{ mt: 2 }}>
          Logout
        </Button>
      </Paper>
    </Box>
  );
};

export default Dashboard;
