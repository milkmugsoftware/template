import { createTheme } from '@mui/material';
import { grey, green, red } from '@mui/material/colors';
import { alpha } from '@mui/material/styles';
import { shadThemeShadows } from './shadows';

const customColors = {
  primary: grey,
  secondary: grey,
  success: green,
  error: red,
  background: {
    dark: '#1A1A1A',
    light: '#F5F5F5',
  },
  text: {
    dark: "#F0F0F0",
    light: '#333333',
  },
};

const darkBackground = alpha(customColors.background.dark, 0.9);
const darkBodyBackground = alpha(customColors.background.dark, 0.95);
const lightBackground = alpha(customColors.background.light, 0.9);
const lightBodyBackground = alpha(customColors.background.light, 0.95);

export const MainTheme = (mode: 'light' | 'dark') => {
  const LightMode = mode === 'light';

  return createTheme({
    palette: {
      mode,
      primary: {
        dark: LightMode ? customColors.primary[300] : customColors.primary[700],
        main: LightMode ? customColors.primary[200] : customColors.primary[500],
        light: LightMode ? customColors.primary[100] : customColors.primary[300],
      },
      secondary: {
        main: LightMode ? customColors.secondary[300] : customColors.secondary[700],
      },
      success: {
        main: LightMode ? customColors.success[400] : customColors.success[600],
      },
      error: {
        main: LightMode ? customColors.error[400] : customColors.error[600],
      },
      info: {
        main: LightMode ? customColors.primary[400] : customColors.primary[600],
      },
      warning: {
        main: LightMode ? customColors.primary[400] : customColors.primary[600],
      },
      divider: LightMode ? alpha(customColors.primary[200], 0.2) : alpha(customColors.primary[700], 0.2),
      background: {
        default: LightMode ? darkBackground : lightBackground,
        paper: LightMode ? darkBackground : lightBackground,
      },
      text: {
        primary: LightMode ? customColors.text.dark : customColors.text.light,
        secondary: LightMode ? alpha(customColors.text.dark, 0.7) : alpha(customColors.text.light, 0.7),
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
            colorScheme: LightMode ? 'dark' : 'light',
          },
          html: {
            minHeight: '100%',
          },
          body: {
            minHeight: '100%',
            backgroundColor: LightMode ? darkBodyBackground : lightBodyBackground,
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
            backgroundColor: LightMode ? alpha(customColors.background.dark, 0.6) : alpha(customColors.background.light, 0.8),
            color: LightMode ? customColors.text.dark : customColors.text.light,
            '&::placeholder': {
              color: LightMode ? alpha(customColors.text.dark, 0.5) : alpha(customColors.text.light, 0.5),
            },
            backdropFilter: 'blur(10px)',
            border: `1px solid ${LightMode ? alpha(customColors.primary[200], 0.23) : alpha(customColors.primary[700], 0.23)}`,
            borderRadius: 12,
            '&:hover': {
              border: `1px solid ${LightMode ? alpha(customColors.primary[200], 0.5) : alpha(customColors.primary[700], 0.5)}`,
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
            color: LightMode ? customColors.text.dark : customColors.text.light,
            backgroundColor: LightMode ? alpha(customColors.primary[700], 0.1) : alpha(customColors.primary[200], 0.1),
            border: `1px solid ${LightMode ? alpha(customColors.primary[200], 0.23) : alpha(customColors.primary[700], 0.23)}`,
            '&:hover': {
              backgroundColor: LightMode ? alpha(customColors.primary[700], 0.2) : alpha(customColors.primary[200], 0.2),
              border: `1px solid ${LightMode ? alpha(customColors.primary[200], 0.5) : alpha(customColors.primary[700], 0.5)}`,
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
            borderBottom: `1px solid ${LightMode ? alpha(customColors.primary[200], 0.2) : alpha(customColors.primary[700], 0.2)}`,
            backdropFilter: 'blur(10px)',
            backgroundColor: LightMode ? alpha(darkBackground, 0.8) : alpha(lightBackground, 0.8),
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: LightMode ? alpha(darkBackground, 0.8) : alpha(lightBackground, 0.8),
            border: `1px solid ${LightMode ? alpha(customColors.primary[200], 0.2) : alpha(customColors.primary[700], 0.2)}`,
            backdropFilter: 'blur(10px)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backdropFilter: 'blur(10px)',
            backgroundColor: LightMode ? alpha(darkBackground, 0.8) : alpha(lightBackground, 0.8),
            border: `1px solid ${LightMode ? alpha(customColors.primary[200], 0.2) : alpha(customColors.primary[700], 0.2)}`,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backdropFilter: 'blur(10px)',
            backgroundColor: LightMode ? alpha(darkBackground, 0.8) : alpha(lightBackground, 0.8),
            border: `1px solid ${LightMode ? alpha(customColors.primary[200], 0.2) : alpha(customColors.primary[700], 0.2)}`,
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            color: LightMode ? customColors.primary[300] : customColors.primary[700],
          },
        },
      },
    },
  });
};
