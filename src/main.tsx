import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/react'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      appearance={{
        layout: {
          unsafe_disableDevelopmentModeWarnings: true,
        },
        elements: {
          footer: { display: 'none' },
          footerPages: { display: 'none' },
          badge: { display: 'none' },
          internal: { display: 'none' },
        },
        userProfile: {
          elements: {
            footer: { display: 'none' },
            badge: { display: 'none' },
          },
        },
        signIn: {
          elements: {
            footer: { display: 'none' },
          },
        },
        signUp: {
          elements: {
            footer: { display: 'none' },
          },
        },
      }}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>,
)
