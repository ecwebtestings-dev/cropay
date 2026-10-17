
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { StrictMode } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <AuthProvider>
            <GoogleOAuthProvider>
                  <App />
            </GoogleOAuthProvider>
      </AuthProvider>
   </StrictMode>
  
)
