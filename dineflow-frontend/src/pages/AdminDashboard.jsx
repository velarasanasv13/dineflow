import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMenuStats, getCategories } from '../api/menu';
import { 
  HiOutlineClipboardList, 
  HiOutlineCurrencyRupee, 
  HiOutlineUserGroup, 
  HiOutlineBookOpen,
  HiOutlineCheckCircle,
  HiOutlinePlus,
  HiOutlineArrowRight,
  HiOutlineSparkles,
  HiOutlineTrendingUp
} from 'react-icons/hi';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMenuStats(), getCategories()])
      .then(([statsData, catsData]) => {
        setStats(statsData);
        setCategories(catsData);
      })
      .catch((err) => console.error('Dashboard load error:', err))
      .finally(() => setLoading(false));
  }, []);

  const metrics = [
    {
      title: "Menu Catalog",
      value: stats ? `${stats.totalDishes} Dishes` : "14 Dishes",
      change: stats ? `${stats.totalCategories} active categories` : "5 categories",
      icon: HiOutlineBookOpen,
      bgColor: "bg-purple-50 text-purple-600 border-purple-100",
      link: "/admin/menu",
    },
    {
      title: "Stock Availability",
      value: stats ? `${stats.inStockDishes} In Stock` : "14 In Stock",
      change: stats ? `${stats.outOfStockDishes} out of stock` : "0 out of stock",
      icon: HiOutlineCheckCircle,
      bgColor: "bg-emerald-50 text-emerald-600 border-emerald-100",
      link: "/admin/menu",
    },
    {
      title: "Active Tables",
      value: "0 / 16",
      change: "Phase 3 Table QR",
      icon: HiOutlineUserGroup,
      bgColor: "bg-blue-50 text-blue-600 border-blue-100",
      link: "/admin/tables",
    },
    {
      title: "Today's Orders",
      value: "Live Kitchen",
      change: "Ready for Phase 3",
      icon: HiOutlineClipboardList,
      bgColor: "bg-amber-50 text-amber-600 border-amber-100",
      link: "/admin/orders",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-dark-900 via-dark-800 to-dark-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-primary-500/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/20 text-primary-300 text-xs font-semibold mb-3 border border-primary-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Phase 2 Active &bull; Menu Catalog & Dish Management
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.username || 'Administrator'}!
            </h1>
            <p className="text-dark-300 text-sm mt-1.5 max-w-xl">
              DineFlow menu catalog is live. You can add dishes, manage categories, set pricing, upload photos and toggle real-time stock availability.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/menu"
              className="btn-primary text-xs py-2.5 px-4 flex items-center gap-2"
            >
              <HiOutlineBookOpen className="w-4 h-4" />
              <span>Open Menu Manager</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div>
        <h2 className="text-base font-bold text-dark-800 mb-4 flex items-center gap-2">
          <HiOutlineTrendingUp className="w-5 h-5 text-primary-500" />
          Live Metrics Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {metrics.map((s, idx) => {
            const Icon = s.icon;
            return (
              <Link key={idx} to={s.link} className="card hover:border-primary-300 transition-all block group">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-dark-400">{s.title}</p>
                    <p className="text-2xl font-bold text-dark-900 mt-1">{s.value}</p>
                    <p className="text-xs text-dark-500 mt-1 font-medium">{s.change}</p>
                  </div>
                  <div className={`p-3 rounded-xl border ${s.bgColor} group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Category Summary & Menu Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Categories breakdown */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-dark-900 flex items-center gap-2">
              <HiOutlineBookOpen className="w-5 h-5 text-primary-500" />
              Configured Menu Categories
            </h3>
            <Link
              to="/admin/menu"
              className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              <span>Manage Dishes</span>
              <HiOutlineArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map((c) => (
              <div
                key={c.id}
                className="p-3.5 rounded-xl border border-dark-100 hover:border-dark-200 transition-all flex items-center gap-3.5 bg-dark-50/40"
              >
                {c.imageUrl ? (
                  <img
                    src={c.imageUrl}
                    alt={c.name}
                    className="w-12 h-12 rounded-lg object-cover border border-dark-200 flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-primary-100 text-primary-700 font-bold flex items-center justify-center flex-shrink-0">
                    {c.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-dark-900 truncate">{c.name}</p>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-100 text-primary-800">
                      {c.dishCount} items
                    </span>
                  </div>
                  <p className="text-xs text-dark-400 truncate mt-0.5">{c.description || 'Category'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dietary Composition */}
        <div className="card flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-dark-900 mb-4 flex items-center gap-2">
              <HiOutlineSparkles className="w-5 h-5 text-primary-500" />
              Dietary Breakdown
            </h3>

            {stats && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="flex items-center gap-1.5 text-emerald-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      Vegetarian ({stats.vegDishes})
                    </span>
                    <span className="text-dark-500">
                      {stats.totalDishes ? Math.round((stats.vegDishes / stats.totalDishes) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-dark-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{
                        width: `${stats.totalDishes ? (stats.vegDishes / stats.totalDishes) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="flex items-center gap-1.5 text-red-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                      Non-Vegetarian ({stats.nonVegDishes})
                    </span>
                    <span className="text-dark-500">
                      {stats.totalDishes ? Math.round((stats.nonVegDishes / stats.totalDishes) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-dark-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 transition-all duration-500"
                      style={{
                        width: `${stats.totalDishes ? (stats.nonVegDishes / stats.totalDishes) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-dark-100">
            <Link
              to="/admin/menu"
              className="w-full btn-secondary text-xs py-2.5 px-4 flex items-center justify-center gap-2"
            >
              <HiOutlinePlus className="w-4 h-4" />
              <span>Add Dish to Menu</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
