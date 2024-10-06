import { createTheme } from '@mui/material';
import { common, green, grey, lightBlue, red } from '@mui/material/colors';
import { alpha } from '@mui/material/styles';
import { shadThemeShadows } from './shadows';

const darkBackground = alpha(common.black, 0.6);
const darkBodyBackground = alpha(common.black, 0.8);
const lightBackground = alpha(common.white, 0.8);
const lightBodyBackground = alpha(common.white, 0.9);

export const shadTheme = (mode: 'light' | 'dark') => {
  const isDarkMode = mode === 'light';

  return createTheme({
    palette: {
      mode,
      primary: {
        dark: isDarkMode ? alpha(grey[200], 0.8) : lightBlue[700],
        main: isDarkMode ? alpha(common.white, 0.8) : lightBlue[500],
        light: isDarkMode ? alpha(grey[800], 0.8) : lightBlue[300],
      },
      secondary: {
        main: isDarkMode ? alpha(grey[100], 0.8) : grey[700],
      },
      success: {
        main: isDarkMode ? alpha(green[900], 0.8) : green[600],
      },
      error: {
        main: isDarkMode ? alpha(red[900], 0.8) : red[600],
      },
      info: {
        main: isDarkMode ? alpha(lightBlue[900], 0.8) : lightBlue[600],
      },
      warning: {
        main: isDarkMode ? alpha(lightBlue[900], 0.8) : lightBlue[600],
      },
      divider: isDarkMode ? alpha(grey[800], 0.6) : alpha(grey[300], 0.6),
      background: {
        default: isDarkMode ? darkBackground : lightBackground,
        paper: isDarkMode ? darkBackground : lightBackground,
      },
      text: {
        primary: isDarkMode ? common.white : common.black,
        secondary: isDarkMode ? alpha(common.white, 0.7) : alpha(common.black, 0.7),
      },
    },
    shape: {
      borderRadius: 12,
    },
    spacing: 8,
    typography: {
      fontSize: 14,
      htmlFontSize: 18,
      fontFamily: [
        'Noto Sans',
        '"Source Sans Pro"',
        '-apple-system',
        'BlinkMacSystemFont',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      fontWeightMedium: 600,
      fontWeightBold: 700,
      h1: {
        fontSize: '3.75rem',
        fontWeight: 600,
      },
      h2: {
        fontSize: '3rem',
        fontWeight: 600,
      },
      h3: {
        fontSize: '2.125rem',
        fontWeight: 600,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
      },
    },
    shadows: shadThemeShadows,
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          ':root': {
            colorScheme: isDarkMode ? 'dark' : 'light',
          },
          html: {
            minHeight: '100%',
          },
          body: {
            minHeight: '100%',
            backgroundColor: isDarkMode ? darkBodyBackground : lightBodyBackground,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'top right',
            backgroundSize: '100%',
            backdropFilter: 'blur(10px)',
          },
        },
      },
      MuiIconButton: {
        defaultProps: {
          disableRipple: true,
        },
      },
      MuiListItemButton: {
        defaultProps: {
          disableRipple: true,
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            backgroundColor: isDarkMode ? alpha(common.black, 0.6) : alpha(common.white, 0.8),
            color: isDarkMode ? common.white : common.black,
            '&::placeholder': {
              color: isDarkMode ? alpha(common.white, 0.5) : alpha(common.black, 0.5),
            },
            backdropFilter: 'blur(10px)',
            border: `1px solid ${isDarkMode ? alpha(common.white, 0.23) : alpha(common.black, 0.23)}`,
            '&:hover': {
              border: `1px solid ${isDarkMode ? alpha(common.white, 0.5) : alpha(common.black, 0.5)}`,
            },
            '&.Mui-focused': {
              border: `2px solid ${isDarkMode ? common.white : common.black}`,
            },
          },
        },
      },
      MuiButtonBase: {
        defaultProps: {
          disableRipple: true,
        },
      },
      MuiButton: {
        defaultProps: {
          disableRipple: true,
        },
        styleOverrides: {
          root: {
            textTransform: 'none',
            boxShadow: 'none',
            backdropFilter: 'blur(10px)',
            color: isDarkMode ? common.white : common.black,
            backgroundColor: isDarkMode ? alpha(common.white, 0.1) : alpha(common.black, 0.1),
            border: `1px solid ${isDarkMode ? alpha(common.white, 0.23) : alpha(common.black, 0.23)}`,
            '&:hover': {
              backgroundColor: isDarkMode ? alpha(common.white, 0.2) : alpha(common.black, 0.2),
              border: `1px solid ${isDarkMode ? alpha(common.white, 0.5) : alpha(common.black, 0.5)}`,
            },
          },
          sizeSmall: {
            padding: '2px 12px',
          },
          sizeMedium: {
            padding: '6px 18px',
          },
          sizeLarge: {
            padding: '10px 24px',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            border: 0,
            borderBottom: `1px solid ${isDarkMode ? alpha(grey[800], 0.6) : alpha(grey[300], 0.6)}`,
            backdropFilter: 'blur(10px)',
            backgroundColor: isDarkMode ? alpha(darkBackground, 0.6) : alpha(lightBackground, 0.8),
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: isDarkMode ? alpha(darkBackground, 0.6) : alpha(lightBackground, 0.8),
            border: `1px solid ${isDarkMode ? alpha(grey[800], 0.6) : alpha(grey[300], 0.6)}`,
            backdropFilter: 'blur(10px)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backdropFilter: 'blur(10px)',
            backgroundColor: isDarkMode ? alpha('#090909', 0.6) : alpha(common.white, 0.8),
            border: `1px solid ${isDarkMode ? alpha(grey[800], 0.6) : alpha(grey[300], 0.6)}`,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backdropFilter: 'blur(10px)',
            backgroundColor: isDarkMode ? alpha('#090909', 0.6) : alpha(common.white, 0.8),
            border: `1px solid ${isDarkMode ? alpha(grey[800], 0.6) : alpha(grey[300], 0.6)}`,
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            color: isDarkMode ? lightBlue[300] : lightBlue[700],
          },
        },
      },
    },
  });
};