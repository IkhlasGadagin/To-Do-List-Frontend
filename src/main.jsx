import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SnackbarProvider } from 'notistack'
import { MantineProvider, createTheme } from '@mantine/core'
import '@mantine/core/styles.css';
import { Auth0Provider } from '@auth0/auth0-react';

const theme = createTheme({
  primaryColor: 'blue',
  defaultRadius: 'md',
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SnackbarProvider maxSnack={3}>
      <MantineProvider theme={theme}>
        <Auth0Provider
          domain="dev-74ceq0ug4guzottn.us.auth0.com"
          clientId="g2iyqpRtD3AvnPYvs3e0774RXNBX8UZ6"
          authorizationParams={{
            redirect_uri: process.env.REDIRECT_URI || "https://video-caption-backend.onrender.com/api/v1/user/callback"
          }}
        >
          <App />
        </Auth0Provider>
      </MantineProvider>
    </SnackbarProvider>
  </StrictMode>,
)
