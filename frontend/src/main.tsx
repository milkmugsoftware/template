import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from '@mui/material/styles'
import { getThemeByName } from './theme.ts'
import CssBaseline from '@mui/material/CssBaseline'
import './i18n'

const theme = getThemeByName('shadTheme', 'dark')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
