import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode StrictMode>
        <BrowserRouter> // App bhitra ko sabai components lai routing ko information available garna.
            <AuthProvider> // App ko sabai components lai user, login, logout, loading ko data provide garna.
                <App />
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>,
)
