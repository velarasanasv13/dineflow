import { NavLink } from 'react-router-dom';
import { 
  HiOutlineViewGrid, 
  HiOutlineBookOpen, 
  HiOutlineClipboardList, 
  HiOutlineQrcode, 
  HiOutlineUserGroup, 
  HiOutlineCurrencyRupee, 
  HiOutlineCog,
  HiOutlineCollection,
  HiOutlineChartBar
} from 'react-icons/hi';

const navItems = [
  { name: 'Dashboard',         path: '/admin/dashboard', icon: HiOutlineViewGrid },
  { name: 'Menu & Categories', path: '/admin/menu',      icon: HiOutlineBookOpen },
  { name: 'All Orders',        path: '/admin/orders',    icon: HiOutlineClipboardList },
  { name: 'Kitchen Display',   path: '/admin/kitchen',   icon: HiOutlineCollection },
  { name: 'Tables & QR Codes', path: '/admin/tables',    icon: HiOutlineQrcode },
  { name: 'Billing & GST',     path: '/admin/billing',   icon: HiOutlineCurrencyRupee },
  { name: 'Reports & Sales',   path: '/admin/reports',   icon: HiOutlineChartBar },
  { name: 'Waiter & Serving',  path: '/admin/waiter',    icon: HiOutlineUserGroup },
  { name: 'Settings',          path: '/admin/settings',  icon: HiOutlineCog },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-dark-900 text-dark-300 min-h-[calc(100vh-4rem)] flex flex-col p-4 border-r border-dark-800">
      <div className="mb-4 px-3 py-2">
        <p className="text-xs font-semibold text-dark-500 uppercase tracking-wider">Management</p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-primary-500 text-white shadow-sm font-semibold'
                    : 'text-dark-300 hover:text-white hover:bg-dark-800'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-dark-800">
        <div className="bg-dark-800/60 rounded-xl p-3 border border-dark-700/50">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-dark-200">System Online</span>
          </div>
          <p className="text-[11px] text-dark-400">DineFlow v1.0.0 (Phase 6)</p>
          <p className="text-[10px] text-dark-500 mt-0.5">PostgreSQL + Spring Boot + React</p>
        </div>
      </div>
    </aside>
  );
}
