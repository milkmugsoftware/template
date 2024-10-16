import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from '@mui/material/styles'
import { MainTheme } from './MainTheme.ts'
import CssBaseline from '@mui/material/CssBaseline'
import './i18n'
import { useMediaQuery } from '@mui/material'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'

function ThemedApp() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const theme = MainTheme(prefersDarkMode ? 'light' : 'dark')

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </I18nextProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemedApp />
  </StrictMode>,
)
