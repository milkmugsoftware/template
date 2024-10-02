import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMediaQuery } from '@mui/material';
import { Box } from '@mui/material';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'transparent',
  boxShadow: 'none',
  borderBottom: `1px solid ${theme.palette.text.primary}`,
}));


const TopNav = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { label: 'Pricing', path: '/pricing' },
    { label: 'Questions', path: '/questions' },
    { label: 'App', path: '/app', isApp: true },
  ];

  return (
    <StyledAppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h5" component={Link} to="/" sx={{ textDecoration: 'none', color: theme.palette.text.primary }}>
          Zenalyx
        </Typography>
        {isMobile ? (
          <>
            <IconButton
              edge="start"
              aria-label="menu"
              onClick={handleMenu}
              sx={{ color: theme.palette.text.primary }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {menuItems.map((item) => (
                <MenuItem key={item.path} onClick={handleClose} component={Link} to={item.path}>
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex' }}>
            {menuItems.map((item) => (
              <motion.div
                key={item.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  component={Link} 
                  to={item.path} 
                  sx={{ 
                    mr: { xs: 0, md: 2 },
                    ...(item.isApp && {
                      backgroundColor: 'common.black',
                      color: 'common.white',
                      '&:hover': {
                        backgroundColor: 'common.black',
                      },
                    }),
                  }}
                >
                  {item.label}
                </Button>
              </motion.div>
            ))}
          </Box>
        )}
      </Toolbar>
    </StyledAppBar>
  );
};

export default TopNav;
