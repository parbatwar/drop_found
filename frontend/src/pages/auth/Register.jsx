import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';


function Register(){

    // state to hold form data
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        phone: '',
    });

    // to navigate to different routes after registration
    const navigate = useNavigate();
    const { login } = useAuth();


    // this updates the formData state whenever an input field changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // this handles the form submission, registers the user, and navigates to the login page
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Register user
            await registerUser(formData);
            navigate('/login');
        }
        catch (error) {
            console.error('Registration failed:', error);
        }
    };

    return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
            <h1 className="text-3xl font-light tracking-[0.15em] mb-2">
            Create Account
            </h1>
            <p className="text-sm text-gray-500 tracking-wide">
            Join and start shopping.
            </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields - Side by Side */}
            <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="first_name" className="sr-only">
                First Name
                </label>
                <input
                type="text"
                id="first_name"
                name="first_name"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full border-b border-gray-300 px-0 py-3 text-sm focus:border-black outline-none transition-colors duration-300 placeholder:text-gray-400"
                required
                />
            </div>
            <div>
                <label htmlFor="last_name" className="sr-only">
                Last Name
                </label>
                <input
                type="text"
                id="last_name"
                name="last_name"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full border-b border-gray-300 px-0 py-3 text-sm focus:border-black outline-none transition-colors duration-300 placeholder:text-gray-400"
                required
                />
            </div>
            </div>

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

            {/* Phone */}
            <div>
            <label htmlFor="phone" className="sr-only">
                Phone (Optional)
            </label>
            <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Phone (Optional)"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border-b border-gray-300 px-0 py-3 text-sm focus:border-black outline-none transition-colors duration-300 placeholder:text-gray-400"
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

            {/* Submit Button */}
            <button
            type="submit"
            className="w-full bg-black text-white py-3.5 text-sm tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors duration-300"
            >
            Create Account
            </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account?{' '}
            <Link
                to="/login"
                className="text-black hover:underline transition-colors duration-200"
            >
                Login
            </Link>
        </p>
        </div>
    </div>
    );
}

export default Register;