import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from '@mui/material/styles'
import { getThemeByName } from './theme.ts'
import CssBaseline from '@mui/material/CssBaseline'

const theme = getThemeByName('shadTheme', 'dark') // You can change 'dark' to 'light' if needed

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
