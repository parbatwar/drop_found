import { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser } from '../api/auth';

// Create a context for authentication
const AuthContext = createContext();

// App lai data provide garna ko lagi AuthProvider component banako ho
export const AuthProvider = ({children}) => {

    // State to hold the current user and loading status
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Page load huda current user ko data fetch garna ko lagi useEffect hook use gareko ho
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            getCurrentUser()
                .then((res) => setUser(res.data))
                .catch(() => localStorage.removeItem('token'))
                .finally(() => setLoading(false) )
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
    }


    // App ko sabai components lai user, login, logout, loading ko data provide garna ko lagi AuthContext.Provider use gareko ho
    return(
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>

    );
}

// Custom hook to use the AuthContext in other components
export const useAuth = () => useContext(AuthContext);


/*
AuthProvider({ children }) — children represents whatever components you wrap inside this provider (your whole app, in main.jsx)
on load, it checks localStorage for a saved token — if found, it calls your backend's /auth/me to fetch the actual user data
.then() — runs if the API call succeeds, saves the user
.catch() — runs if it fails (invalid/expired token), removes the bad token
.finally() — runs no matter what, stops the loading state
login() and logout() are the two functions every component will call when someone logs in/out
useAuth() is a shortcut — instead of writing useContext(AuthContext) everywhere, any component just calls useAuth() and gets { user, login, logout, loading }
*/