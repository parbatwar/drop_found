import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.jsx';
import './index.css';

import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root')).render(
    <StrictMode StrictMode>
        <BrowserRouter>     {/* App bhitra ko sabai components lai routing ko information available garna. */}
            <AuthProvider>          {/* App ko sabai components lai user, login, logout, loading ko data provide garna. */}
                <App />
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>,
)
