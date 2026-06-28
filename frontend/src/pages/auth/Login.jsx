import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser, getCurrentUser } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

function Login(){
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const loginRes = await loginUser(formData);
            const token = loginRes.data.access_token;

            // Save token FIRST so the interceptor can use it
            localStorage.setItem('token', token);

            const userRes = await getCurrentUser();

            // Now update context state with user info
            login(token, userRes.data);

            navigate('/');
        } catch (error) {
            console.error('Login failed:', error);
            alert('Invalid email or password');
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                <label htmlFor="email" className="sr-only">
                    Email
                </label>
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

                {/* Password */}
                <div>
                <label htmlFor="password" className="sr-only">
                    Password
                </label>
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

                {/* Forgot Password Link */}
                <div className="text-right">
                <a 
                    href="#" 
                    className="text-xs text-gray-400 hover:text-black transition-colors duration-200 tracking-wide"
                >
                    Forgot Password?
                </a>
                </div>

                {/* Submit Button */}
                <button
                type="submit"
                className="w-full bg-black text-white py-3.5 text-sm tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors duration-300"
                >
                Sign In
                </button>
            </form>

            {/* Register Link */}
            <p className="text-center text-sm text-gray-500 mt-8">
                Don't have an account?{' '}
                <Link
                    to="/register"
                    className="text-black hover:underline transition-colors duration-200"
                >
                    Create Account
                </Link>
            </p>

            {/* Divider */}
            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-white text-gray-400 tracking-[0.2em] uppercase">
                    Or continue with
                </span>
                </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-4">
                <button className="border border-gray-200 py-3 text-xs tracking-[0.1em] uppercase hover:border-black hover:bg-black hover:text-white transition-all duration-300">
                Google
                </button>
                <button className="border border-gray-200 py-3 text-xs tracking-[0.1em] uppercase hover:border-black hover:bg-black hover:text-white transition-all duration-300">
                Apple
                </button>
            </div>
            </div>
        </div>
    );

}

export default Login;