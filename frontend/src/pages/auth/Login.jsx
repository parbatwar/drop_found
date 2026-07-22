// pages/auth/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, getCurrentUser } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // ✅ Email/Password Login (for existing users)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const loginRes = await loginUser(formData);
            const token = loginRes.data.access_token;

            // Save token
            localStorage.setItem('token', token);

            const userRes = await getCurrentUser();

            // Update context
            login(token, userRes.data);

            // Redirect based on role
            if (userRes.data.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error('Login failed:', error);
            
            if (error.response?.status === 403 && 
                error.response?.data?.detail?.includes('verify your email')) {
                setError('⚠️ Email not verified. Please check your inbox or use Google to login.');
            } else {
                setError(error.response?.data?.detail || 'Invalid email or password');
            }
        } finally {
            setLoading(false);
        }
    };

    // ✅ Google OAuth Login (for new users)
    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        try {
            // ✅ Get auth URL from backend
            const response = await fetch('http://localhost:8000/auth/google/login');
            const data = await response.json();
            
            console.log('🔍 Redirecting to Google:', data.auth_url);
            
            // ✅ Redirect to Google
            window.location.href = data.auth_url;
        } catch (err) {
            console.error('Google login failed:', err);
            setError('Failed to start Google login. Please try again.');
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-light tracking-[0.15em] mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-sm text-gray-500 tracking-wide">
                        Sign in to your account.
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm">
                        {error}
                    </div>
                )}

                {/* ✅ Email/Password Form (For existing users) */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="sr-only">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border-b border-gray-300 px-0 py-3 text-sm focus:border-black outline-none transition-colors duration-300 placeholder:text-gray-400"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full border-b border-gray-300 px-0 py-3 text-sm focus:border-black outline-none transition-colors duration-300 placeholder:text-gray-400"
                            required
                        />
                    </div>

                    <div className="text-right">
                        <a 
                            href="#" 
                            className="text-xs text-gray-400 hover:text-black transition-colors duration-200 tracking-wide"
                        >
                            Forgot Password?
                        </a>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-3.5 text-sm tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in...' : 'Sign In with Email'}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="px-4 bg-white text-gray-400 tracking-[0.2em] uppercase">
                            Or continue with
                        </span>
                    </div>
                </div>

                {/* ✅ Google Login Button (Below email form) */}
                <button
                    onClick={handleGoogleLogin}
                    disabled={googleLoading}
                    className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 px-4 hover:bg-gray-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span className="text-sm font-medium">
                        {googleLoading ? 'Redirecting...' : 'Sign in with Google'}
                    </span>
                </button>

                <div className="text-center text-xs text-gray-400 mt-2">
                    <span>New users sign up instantly with Google</span>
                </div>

                {/* Register Link */}
                <p className="text-center text-sm text-gray-500 mt-8">
                    Don't have an account?{' '}
                    <Link
                        to="/register"
                        className="text-black hover:underline transition-colors duration-200"
                    >
                        Create Account with Google
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;