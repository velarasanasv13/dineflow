import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCategories, getDishes } from '../api/menu';
import { placeOrder } from '../api/orders';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { 
  HiOutlineSearch, 
  HiOutlineUser, 
  HiOutlineShoppingBag, 
  HiOutlineClock, 
  HiOutlineFire, 
  HiOutlinePlus, 
  HiOutlineMinus,
  HiOutlineTrash,
  HiOutlineShieldCheck,
  HiOutlineLockClosed,
  HiOutlineChatAlt2,
  HiOutlineX
} from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function Home() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { 
    customerName, 
    setCustomerName, 
    cartCount, 
    cartSubtotal,
    gstAmount,
    grandTotal, 
    addToCart, 
    decrementItem, 
    removeFromCart,
    getItemQuantity,
    itemsList,
    clearCart,
    sessionId
  } = useCart();

  // Data state
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const tables = ['T-01', 'T-02', 'T-03', 'T-04', 'T-05', 'T-06', 'T-07', 'T-08'];
  const [selectedTable, setSelectedTable] = useState('T-01');
  const [loading, setLoading] = useState(true);

  // Filter state
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [dietaryFilter, setDietaryFilter] = useState('ALL'); // 'ALL', 'VEG', 'NON_VEG'
  const [search, setSearch] = useState('');

  // Cart Drawer & Order placing
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [guestName, setGuestName] = useState(customerName || '');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Admin Login Modal
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [adminError, setAdminError] = useState('');
  const [adminLoggingIn, setAdminLoggingIn] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [catsData, dishesData] = await Promise.all([
          getCategories(true),
          getDishes({ available: true })
        ]);
        setCategories(catsData || []);
        setDishes(dishesData || []);
      } catch (err) {
        console.error('Failed to load menu data:', err);
        toast.error('Failed to load menu items.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminError('');
    setAdminLoggingIn(true);
    try {
      await login(adminUsername.trim(), adminPassword);
      setIsAdminModalOpen(false);
      toast.success('Admin login successful!');
      navigate('/admin/dashboard');
    } catch (err) {
      setAdminError('Invalid admin username or password');
    } finally {
      setAdminLoggingIn(false);
    }
  };

  const handlePlaceOrderNow = async (e) => {
    e.preventDefault();
    const finalName = guestName.trim() || 'Guest Customer';
    setCustomerName(finalName);

    if (itemsList.length === 0) {
      toast.error('Please add at least one dish to your order');
      return;
    }

    try {
      setIsSubmittingOrder(true);
      const payload = {
        tableNumber: selectedTable,
        customerName: finalName,
        customerSessionId: sessionId,
        specialInstructions: specialInstructions.trim(),
        items: itemsList.map((item) => ({
          dishId: item.dish.id,
          quantity: item.quantity,
          specialNotes: item.specialNotes || '',
        })),
      };

      const order = await placeOrder(payload);
      toast.success(`🎉 Order #${order.orderNumber} placed for Table ${selectedTable}!`);
      clearCart();
      setIsCartOpen(false);
      navigate(`/order/track/${order.orderNumber}`);
    } catch (err) {
      console.error('Order placement error:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to place order';
      toast.error(msg);
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  // Filtered dishes
  const filteredDishes = dishes.filter((dish) => {
    if (activeCategory !== 'ALL' && dish.categoryId?.toString() !== activeCategory) {
      return false;
    }
    if (dietaryFilter === 'VEG' && dish.dietaryType !== 'VEG' && dish.dietaryType !== 'VEGAN') {
      return false;
    }
    if (dietaryFilter === 'NON_VEG' && dish.dietaryType !== 'NON_VEG') {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = dish.name.toLowerCase().includes(q);
      const matchDesc = dish.description?.toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-28 text-slate-900">
      {/* ── Top Navigation Bar ───────────────────────────────────────────── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-400 flex items-center justify-center text-white font-extrabold text-lg shadow-md">
              🍽️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-lg tracking-tight">DineFlow</span>
                <span className="bg-orange-100 text-orange-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-orange-200">
                  Customer Ordering
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Select dishes, customize &amp; send straight to kitchen</p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            {/* Table Selector */}
            <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1.5 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-500">🪑</span>
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer"
                title="Select your dining table"
              >
                {tables.map((t) => (
                  <option key={t} value={t}>
                    Table {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-600 transition border border-orange-200 flex items-center gap-1"
              title="View Cart"
            >
              <HiOutlineShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-orange-600 text-white rounded-full text-[11px] font-black flex items-center justify-center shadow-md animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* 🛡️ TOP RIGHT CORNER: ADMIN LOGIN ICON */}
            <button
              onClick={() => {
                setAdminError('');
                setIsAdminModalOpen(true);
              }}
              title="Admin &amp; Staff Login (Add items, Kitchen KDS, Billing)"
              className="flex items-center gap-1.5 p-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition hover:scale-105"
            >
              <HiOutlineLockClosed className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Food Ordering Content ──────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 pt-5 space-y-5">
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-orange-950 text-white p-5 rounded-3xl shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
              Ready to Order &bull; Table {selectedTable}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold mt-1 tracking-tight">
              Order Delicious Food Direct to Your Table 🍕🍛
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Select dishes below, enter your name, and send your ticket straight to the chefs in our live kitchen. No account required.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={guestName}
              onChange={(e) => {
                setGuestName(e.target.value);
                setCustomerName(e.target.value);
              }}
              placeholder="Your Name (e.g. Rahul)"
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder-slate-400 font-semibold outline-none focus:ring-2 focus:ring-orange-400 w-44"
            />
          </div>
        </div>

        {/* Search & Dietary Filters */}
        <div className="space-y-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <HiOutlineSearch className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dishes (e.g. Biryani, Paneer Tikka, Kulfi, Mojito)..."
              className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none shadow-sm font-medium"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Dietary Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setDietaryFilter('ALL')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                dietaryFilter === 'ALL'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Items ({dishes.length})
            </button>

            <button
              onClick={() => setDietaryFilter('VEG')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                dietaryFilter === 'VEG'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Veg Only</span>
            </button>

            <button
              onClick={() => setDietaryFilter('NON_VEG')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                dietaryFilter === 'NON_VEG'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Non-Veg Only</span>
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
          <button
            onClick={() => setActiveCategory('ALL')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all whitespace-nowrap border-b-2 ${
              activeCategory === 'ALL'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            All Menu
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id.toString())}
              className={`pb-2.5 px-3 text-xs font-bold transition-all whitespace-nowrap border-b-2 ${
                activeCategory === c.id.toString()
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Dishes Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-600">Loading fresh menu dishes...</p>
          </div>
        ) : filteredDishes.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-400">
            <p className="text-base font-semibold">No dishes found matching your selection.</p>
            <p className="text-xs mt-1">Try clearing search or picking another category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDishes.map((dish) => {
              const qty = getItemQuantity(dish.id);
              const isVeg = dish.dietaryType === 'VEG' || dish.dietaryType === 'VEGAN';

              return (
                <div
                  key={dish.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="flex gap-3">
                    <img
                      src={dish.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'}
                      alt={dish.name}
                      className="w-24 h-24 rounded-2xl object-cover shadow-inner border border-slate-100 flex-shrink-0"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600';
                      }}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`w-3.5 h-3.5 border-2 rounded-sm flex items-center justify-center ${
                          isVeg ? 'border-emerald-600' : 'border-rose-600'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {dish.categoryName}
                        </span>
                        {dish.spicyLevel > 0 && (
                          <span className="flex text-rose-500 ml-1" title={`Spiciness: ${dish.spicyLevel}/3`}>
                            {[...Array(dish.spicyLevel)].map((_, i) => (
                              <HiOutlineFire key={i} className="w-3.5 h-3.5 fill-rose-500" />
                            ))}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1">
                        {dish.name}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {dish.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-base font-black text-slate-900">₹{dish.price?.toFixed(2)}</span>
                      {dish.prepTimeMinutes && (
                        <span className="text-[10px] text-slate-400 ml-2 inline-flex items-center gap-0.5">
                          <HiOutlineClock className="w-3 h-3" />
                          {dish.prepTimeMinutes}m
                        </span>
                      )}
                    </div>

                    {/* Stepper or Add button */}
                    {qty === 0 ? (
                      <button
                        onClick={() => addToCart(dish)}
                        className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1"
                      >
                        <HiOutlinePlus className="w-3.5 h-3.5" />
                        <span>ADD</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 bg-slate-900 text-white rounded-xl px-2 py-1 shadow-sm">
                        <button
                          onClick={() => decrementItem(dish.id)}
                          className="text-white hover:text-orange-400 p-0.5"
                        >
                          <HiOutlineMinus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-extrabold text-xs text-orange-400 w-4 text-center">{qty}</span>
                        <button
                          onClick={() => addToCart(dish)}
                          className="text-white hover:text-orange-400 p-0.5"
                        >
                          <HiOutlinePlus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ── Sticky Floating Cart Bar ────────────────────────────────────── */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 z-40 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none">
          <div className="max-w-md mx-auto pointer-events-auto">
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white p-3.5 rounded-2xl shadow-2xl flex items-center justify-between transition transform hover:scale-[1.01]"
            >
              <div className="text-left">
                <span className="text-[11px] uppercase tracking-wider font-bold opacity-90 block">
                  {cartCount} {cartCount === 1 ? 'Dish' : 'Dishes'} in Cart &bull; Table {selectedTable}
                </span>
                <span className="text-base font-black">₹{grandTotal.toFixed(2)}</span>
                <span className="text-[10px] opacity-80 ml-1.5">(incl. 5% GST)</span>
              </div>

              <div className="flex items-center gap-1.5 font-bold text-sm bg-white/20 px-3.5 py-1.5 rounded-xl">
                <span>Review &amp; Place Order</span>
                <span>&rarr;</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* ── Cart Drawer / Modal ─────────────────────────────────────────── */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-md h-full flex flex-col justify-between shadow-2xl animate-slideLeft">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Your Dining Cart</h2>
                <p className="text-xs text-orange-600 font-bold">Table {selectedTable}</p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>

            {/* Items List */}
            <div className="p-4 overflow-y-auto flex-1 space-y-4">
              {/* Customer Name Input */}
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-3.5 space-y-1.5">
                <label className="text-xs font-bold text-orange-950 flex items-center gap-1.5">
                  <HiOutlineUser className="w-4 h-4 text-orange-600" />
                  <span>Your Name *</span>
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => {
                    setGuestName(e.target.value);
                    setCustomerName(e.target.value);
                  }}
                  placeholder="Enter your name (e.g. Rahul, Priya)"
                  className="w-full bg-white border border-orange-200 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {itemsList.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <span className="text-4xl block mb-2">🛒</span>
                  <p className="text-sm font-semibold">Your cart is empty.</p>
                </div>
              ) : (
                <div className="space-y-3 divide-y divide-slate-100">
                  {itemsList.map(({ dish, quantity, specialNotes }) => (
                    <div key={dish.id} className="pt-3 first:pt-0 flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{dish.name}</p>
                        <p className="text-xs text-slate-500">₹{dish.price?.toFixed(2)} each</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-slate-100 rounded-lg px-2 py-1">
                          <button
                            onClick={() => decrementItem(dish.id)}
                            className="p-0.5 text-slate-600 hover:text-slate-900"
                          >
                            <HiOutlineMinus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-slate-900">
                            {quantity}
                          </span>
                          <button
                            onClick={() => addToCart(dish)}
                            className="p-0.5 text-slate-600 hover:text-slate-900"
                          >
                            <HiOutlinePlus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="text-xs font-extrabold text-slate-900 w-14 text-right">
                          ₹{(dish.price * quantity).toFixed(2)}
                        </span>

                        <button
                          onClick={() => removeFromCart(dish.id)}
                          className="text-slate-400 hover:text-rose-500 p-1"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Kitchen Instructions */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <HiOutlineChatAlt2 className="w-4 h-4 text-orange-500" />
                  <span>Kitchen Special Notes</span>
                </label>
                <textarea
                  rows={2}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Extra spicy, no onions, bring drinks with starters..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-orange-300 resize-none font-medium"
                />
              </div>

              {/* Bill Breakdown */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>₹{cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>5% GST (CGST 2.5% + SGST 2.5%)</span>
                  <span>₹{gstAmount.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-slate-900">
                  <span>Total Amount</span>
                  <span className="text-orange-600">₹{grandTotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 pt-1">
                  <HiOutlineShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Pay after dining directly at your table or counter.</span>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-slate-200 bg-white">
              <button
                onClick={handlePlaceOrderNow}
                disabled={isSubmittingOrder || itemsList.length === 0}
                className="w-full bg-orange-600 hover:bg-orange-700 active:bg-orange-800 disabled:opacity-50 text-white font-extrabold py-3.5 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition"
              >
                {isSubmittingOrder ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending to Kitchen...</span>
                  </>
                ) : (
                  <span>Send Order to Kitchen &bull; ₹{grandTotal.toFixed(2)}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 🛡️ Admin Login Modal (Triggered by Top Right Icon) ─────────── */}
      {isAdminModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsAdminModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 relative border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsAdminModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <HiOutlineX className="w-5 h-5" />
            </button>

            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center mx-auto mb-2 text-xl shadow-md">
                🔐
              </div>
              <h2 className="text-lg font-bold text-slate-900">Admin &amp; Staff Login</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage live kitchen orders, dishes, billing &amp; sales
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="admin123"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {adminError && (
                <div className="bg-rose-50 text-rose-700 text-xs p-2 rounded-lg font-semibold text-center border border-rose-200">
                  {adminError}
                </div>
              )}

              <button
                type="submit"
                disabled={adminLoggingIn}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-md"
              >
                {adminLoggingIn ? 'Verifying...' : 'Sign In to Dashboard'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
