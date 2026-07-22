// context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser } from '../api/auth';
import apiClient from '../api/client';

// Create a context for authentication
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // ✅ Handle Google OAuth callback on page load
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            localStorage.setItem('token', token);
            // Clean the token out of the URL immediately so it doesn't linger
            window.history.replaceState({}, document.title, window.location.pathname);
            
            getCurrentUser()
                .then((res) => {
                    setUser(res.data);
                    // Redirect user based on role if they landed on root
                    if (res.data.role === 'admin') {
                        window.location.href = '/admin/dashboard';
                    }
                })
                .catch((err) => {
                    console.error('Session initialization failed:', err);
                    localStorage.removeItem('token');
                });
        }
    }, []);

    // Page load huda current user ko data fetch garna ko lagi useEffect hook use gareko ho
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            getCurrentUser()
                .then((res) => setUser(res.data))
                .catch(() => {
                    localStorage.removeItem('token');
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    // Save token and update user state
    const login = (token, userData) => {
        localStorage.setItem('token', token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);