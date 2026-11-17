import { useAuth } from '../context/AuthContext';
import { HiOutlineLogout, HiOutlineUserCircle, HiOutlineBell } from 'react-icons/hi';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-dark-100 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-white font-bold text-lg shadow-md">
          DF
        </div>
        <div>
          <h1 className="font-bold text-dark-900 tracking-tight text-lg leading-tight">DineFlow</h1>
          <p className="text-xs text-dark-400 font-medium">Restaurant Administration</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          type="button"
          className="p-2 text-dark-400 hover:text-dark-700 hover:bg-dark-50 rounded-lg transition-colors relative"
          title="Notifications"
        >
          <HiOutlineBell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full"></span>
        </button>

        <div className="h-6 w-px bg-dark-200"></div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-sm">
              {user?.username ? user.username.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-dark-800 leading-none">
                {user?.username || 'Admin'}
              </p>
              <span className="text-xs text-primary-600 font-medium capitalize">
                {user?.role ? user.role.toLowerCase().replace('_', ' ') : 'Administrator'}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-xs font-medium text-dark-500 hover:text-accent-500 hover:bg-accent-50 px-3 py-1.5 rounded-lg border border-dark-200 hover:border-accent-200 transition-colors ml-2"
            title="Log Out"
          >
            <HiOutlineLogout className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

