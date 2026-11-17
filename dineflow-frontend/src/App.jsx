import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import CustomerMenu from './pages/CustomerMenu';
import CustomerCart from './pages/CustomerCart';
import CustomerOrderTrack from './pages/CustomerOrderTrack';
import AdminLogin from './pages/AdminLogin';

// Admin Protected Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminMenu from './pages/AdminMenu';
import AdminTables from './pages/AdminTables';
import AdminOrders from './pages/AdminOrders';
import AdminKitchen from './pages/AdminKitchen';
import AdminBilling from './pages/AdminBilling';
import AdminReports from './pages/AdminReports';

import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      {/* Root points to the Public Customer Experience */}
      <Route path="/" element={<Home />} />

      {/* Customer QR / Table Ordering (NO LOGIN REQUIRED) */}
      <Route path="/table/:tableNumber" element={<CustomerMenu />} />
      <Route path="/table/:tableNumber/cart" element={<CustomerCart />} />
      <Route path="/order/track/:orderNumber" element={<CustomerOrderTrack />} />

      {/* Admin Direct Login Route */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="menu" element={<AdminMenu />} />
        <Route path="tables" element={<AdminTables />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="kitchen" element={<AdminKitchen />} />
        <Route path="billing" element={<AdminBilling />} />
        <Route path="reports" element={<AdminReports />} />
        
        <Route
          path="waiter"
          element={
            <div className="card p-8 text-center text-dark-500">
              <h2 className="text-xl font-bold text-dark-800 mb-2">Waiter Dashboard &amp; Serving</h2>
              <p>Dish delivery and table service tracking.</p>
            </div>
          }
        />
        <Route
          path="settings"
          element={
            <div className="card p-8 text-center text-dark-500">
              <h2 className="text-xl font-bold text-dark-800 mb-2">System Settings</h2>
              <p>Restaurant profile, GST percentage (currently 5%), and user management.</p>
            </div>
          }
        />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
