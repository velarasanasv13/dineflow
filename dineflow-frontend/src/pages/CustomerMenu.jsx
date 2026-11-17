import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resolveTable } from '../api/tables';
import { getCategories, getDishes } from '../api/menu';
import { useCart } from '../context/CartContext';
import { 
  HiOutlineSearch, 
  HiOutlineUser, 
  HiOutlineShoppingBag, 
  HiOutlineClock, 
  HiOutlineFire, 
  HiOutlinePlus, 
  HiOutlineMinus,
  HiOutlineClipboardList
} from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function CustomerMenu() {
  const { tableNumber } = useParams();
  const navigate = useNavigate();
  const { 
    customerName, 
    setCustomerName, 
    setTableNumber, 
    cartCount, 
    grandTotal, 
    addToCart, 
    decrementItem, 
    getItemQuantity 
  } = useCart();

  const [table, setTable] = useState(null);
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [dietaryFilter, setDietaryFilter] = useState('ALL'); // 'ALL', 'VEG', 'NON_VEG'
  const [search, setSearch] = useState('');

  // Customer Name Modal
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [tempName, setTempName] = useState(customerName);

  useEffect(() => {
    if (tableNumber) {
      setTableNumber(tableNumber);
    }
  }, [tableNumber, setTableNumber]);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const [tableData, catsData, dishesData] = await Promise.all([
          resolveTable(tableNumber),
          getCategories(true),
          getDishes({ available: true }),
        ]);

        setTable(tableData);
        setCategories(catsData);
        setDishes(dishesData);

        // Prompt for customer name if not already set
        if (!customerName) {
          setIsNameModalOpen(true);
        }
      } catch (err) {
        console.error('Failed to load table menu:', err);
        toast.error('Table not found or server unreachable.');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [tableNumber]);

  const handleSaveName = (e) => {
    e.preventDefault();
    if (!tempName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    setCustomerName(tempName.trim());
    setIsNameModalOpen(false);
    toast.success(`Welcome, ${tempName.trim()}! Start adding dishes.`);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-semibold text-dark-700">Loading DineFlow Menu...</p>
          <p className="text-xs text-dark-400 mt-1">Table {tableNumber}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-50 pb-28 font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-dark-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-white font-bold text-base shadow-sm">
              DF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-dark-900 text-base leading-tight">DineFlow</h1>
                <span className="bg-primary-100 text-primary-800 text-xs font-extrabold px-2 py-0.5 rounded-full">
                  Table {table?.tableNumber || tableNumber}
                </span>
              </div>
              <p className="text-[11px] text-dark-400">Order directly from your table</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Customer Name Pill */}
            <button
              onClick={() => {
                setTempName(customerName);
                setIsNameModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-100 hover:bg-dark-200 text-dark-700 text-xs font-semibold transition-colors"
            >
              <HiOutlineUser className="w-3.5 h-3.5 text-primary-600" />
              <span className="max-w-[80px] truncate">{customerName || 'Add Name'}</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => navigate(`/table/${tableNumber}/cart`)}
              className="relative p-2 rounded-lg bg-primary-50 hover:bg-primary-100 text-primary-600 transition-colors"
              title="View Cart"
            >
              <HiOutlineShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-4xl mx-auto px-4 pt-4 space-y-4">
        {/* Welcome Greeting Banner */}
        <div className="bg-gradient-to-r from-dark-900 to-dark-800 text-white p-4 rounded-2xl shadow-md flex items-center justify-between">
          <div>
            <p className="text-xs text-primary-400 font-semibold uppercase tracking-wider">
              Dining at Table {table?.tableNumber || tableNumber}
            </p>
            <h2 className="text-lg font-bold mt-0.5">
              Welcome{customerName ? `, ${customerName}` : ''}! 🍽️
            </h2>
            <p className="text-xs text-dark-300 mt-0.5">
              Select dishes below & place your order. Anyone at this table can order anytime.
            </p>
          </div>

          <Link
            to={`/order/track/table-${tableNumber}`}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20 whitespace-nowrap"
          >
            <HiOutlineClipboardList className="w-4 h-4 text-primary-400" />
            <span>Table Orders</span>
          </Link>
        </div>

        {/* Search Bar & Dietary Filter */}
        <div className="space-y-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-dark-400">
              <HiOutlineSearch className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search starters, biryanis, desserts..."
              className="input-field pl-10 text-xs py-2.5 shadow-sm"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-dark-400 hover:text-dark-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Dietary Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setDietaryFilter('ALL')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                dietaryFilter === 'ALL'
                  ? 'bg-dark-900 text-white shadow-sm'
                  : 'bg-white text-dark-600 hover:bg-dark-100 border border-dark-200'
              }`}
            >
              All Items
            </button>

            <button
              onClick={() => setDietaryFilter('VEG')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
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
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                dietaryFilter === 'NON_VEG'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-white text-red-700 hover:bg-red-50 border border-red-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>Non-Veg Only</span>
            </button>
          </div>
        </div>

        {/* Categories Horizontal Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-dark-200/60">
          <button
            onClick={() => setActiveCategory('ALL')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all whitespace-nowrap border-b-2 ${
              activeCategory === 'ALL'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-dark-500 hover:text-dark-800'
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
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-dark-500 hover:text-dark-800'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Dishes List */}
        {filteredDishes.length === 0 ? (
          <div className="card p-8 text-center text-dark-400">
            <p className="text-sm font-semibold">No dishes found matching your filters.</p>
            <p className="text-xs mt-1">Try selecting another category or dietary type.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDishes.map((dish) => {
              const qty = getItemQuantity(dish.id);
              const isVeg = dish.dietaryType === 'VEG' || dish.dietaryType === 'VEGAN';

              return (
                <div
                  key={dish.id}
                  className="bg-white rounded-2xl p-3.5 border border-dark-100 shadow-sm hover:shadow-md transition-shadow flex gap-3.5 items-center justify-between"
                >
                  {/* Left: Details */}
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`w-3.5 h-3.5 border-2 rounded-sm flex items-center justify-center ${
                        isVeg ? 'border-emerald-600' : 'border-red-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isVeg ? 'bg-emerald-600' : 'bg-red-600'}`} />
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-dark-400">
                        {dish.categoryName}
                      </span>
                      {dish.spicyLevel > 0 && (
                        <span className="flex text-red-500 ml-1" title={`Spiciness: ${dish.spicyLevel}/3`}>
                          {[...Array(dish.spicyLevel)].map((_, i) => (
                            <HiOutlineFire key={i} className="w-3.5 h-3.5 fill-red-500" />
                          ))}
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-dark-900 text-sm leading-tight truncate">
                      {dish.name}
                    </h3>

                    <p className="text-xs text-dark-500 line-clamp-2 mt-0.5 leading-relaxed">
                      {dish.description}
                    </p>

                    <div className="mt-2 flex items-center gap-3">
                      <span className="text-base font-extrabold text-dark-900">
                        ₹{dish.price?.toFixed(2)}
                      </span>
                      {dish.prepTimeMinutes && (
                        <span className="text-[11px] text-dark-400 flex items-center gap-1">
                          <HiOutlineClock className="w-3 h-3" />
                          {dish.prepTimeMinutes}m
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Image & Action Button */}
                  <div className="flex flex-col items-center gap-2 flex-shrink-0 w-28">
                    <img
                      src={dish.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'}
                      alt={dish.name}
                      className="w-24 h-20 rounded-xl object-cover shadow-inner border border-dark-100"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600';
                      }}
                    />

                    {/* Stepper or Add button */}
                    {qty === 0 ? (
                      <button
                        onClick={() => addToCart(dish)}
                        className="w-24 py-1.5 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1"
                      >
                        <HiOutlinePlus className="w-3.5 h-3.5" />
                        <span>ADD</span>
                      </button>
                    ) : (
                      <div className="w-24 flex items-center justify-between bg-dark-900 text-white rounded-xl px-2 py-1 shadow-sm">
                        <button
                          onClick={() => decrementItem(dish.id)}
                          className="text-white hover:text-primary-400 p-0.5"
                        >
                          <HiOutlineMinus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-extrabold text-xs text-primary-400">{qty}</span>
                        <button
                          onClick={() => addToCart(dish)}
                          className="text-white hover:text-primary-400 p-0.5"
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

      {/* Floating Sticky Bottom Cart Ribbon */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 z-40 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none">
          <div className="max-w-md mx-auto pointer-events-auto">
            <button
              onClick={() => navigate(`/table/${tableNumber}/cart`)}
              className="w-full bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white p-3.5 rounded-2xl shadow-xl shadow-primary-500/30 flex items-center justify-between transition-all transform hover:scale-[1.01]"
            >
              <div className="text-left">
                <span className="text-[11px] uppercase tracking-wider font-semibold opacity-90 block">
                  {cartCount} {cartCount === 1 ? 'Dish' : 'Dishes'} Selected
                </span>
                <span className="text-base font-extrabold">₹{grandTotal.toFixed(2)}</span>
                <span className="text-[10px] opacity-80 ml-1.5">(incl. 5% GST)</span>
              </div>

              <div className="flex items-center gap-1.5 font-bold text-sm bg-white/20 px-3 py-1.5 rounded-xl">
                <span>View Cart</span>
                <span>&rarr;</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Customer Name Modal */}
      {isNameModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center animate-fadeIn border border-dark-100">
            <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <HiOutlineUser className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-dark-900">What is your name?</h3>
            <p className="text-xs text-dark-500 mt-1 mb-4">
              Enter your name so the kitchen & waiter know who ordered which dish at Table {tableNumber}!
            </p>

            <form onSubmit={handleSaveName} className="space-y-4">
              <input
                type="text"
                required
                autoFocus
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="e.g. Rahul, Priya, Alex"
                className="input-field text-center text-sm font-semibold"
              />

              <button
                type="submit"
                className="w-full btn-primary text-xs py-3 rounded-xl shadow-md"
              >
                Start Ordering
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

