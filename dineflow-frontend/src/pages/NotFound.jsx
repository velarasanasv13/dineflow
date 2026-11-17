import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-50 p-4">
      <div className="text-center max-w-md">
        <div className="text-7xl font-extrabold text-primary-500 mb-2">404</div>
        <h2 className="text-2xl font-bold text-dark-900 mb-2">Page Not Found</h2>
        <p className="text-sm text-dark-500 mb-6">
          The requested page does not exist or has been moved.
        </p>
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center justify-center px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg shadow transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}

