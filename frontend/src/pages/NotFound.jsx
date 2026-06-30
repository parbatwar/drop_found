// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-6xl font-light mb-4">404</h1>
      <h2 className="text-2xl font-light mb-6">Page Not Found</h2>
      <p className="text-gray-600 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="bg-black text-white px-8 py-3 text-sm tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}

export default NotFound;