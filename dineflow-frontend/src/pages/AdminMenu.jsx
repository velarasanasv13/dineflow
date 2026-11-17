import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  HiOutlinePlus, 
  HiOutlineFolder, 
  HiOutlineSearch, 
  HiOutlineFilter,
  HiOutlineRefresh,
  HiOutlineSparkles,
  HiOutlineExclamation
} from 'react-icons/hi';
import { 
  getDishes, 
  getCategories, 
  getMenuStats, 
  createDish, 
  updateDish, 
  deleteDish, 
  toggleDishAvailability 
} from '../api/menu';
import DishCard from '../components/DishCard';
import DishModal from '../components/DishModal';
import CategoryModal from '../components/CategoryModal';
import toast from 'react-hot-toast';

export default function AdminMenu() {
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDietary, setSelectedDietary] = useState('ALL');
  const [selectedAvailability, setSelectedAvailability] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [deletingDish, setDeletingDish] = useState(null);

  // Load initial data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [catsData, statsData] = await Promise.all([
        getCategories(),
        getMenuStats(),
      ]);
      setCategories(catsData);
      setStats(statsData);

      // Load dishes with current filters
      await fetchDishes();
    } catch (err) {
      console.error('Failed to load menu data:', err);
      toast.error('Failed to load menu data from server');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDishes = async () => {
    try {
      const params = {};
      if (selectedCategory !== 'ALL') params.categoryId = selectedCategory;
      if (selectedDietary !== 'ALL') params.dietaryType = selectedDietary;
      if (selectedAvailability !== 'ALL') params.available = selectedAvailability === 'IN_STOCK';
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const dishesData = await getDishes(params);
      setDishes(dishesData);
    } catch (err) {
      console.error('Failed to load dishes:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Re-fetch dishes when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDishes();
    }, 200);
    return () => clearTimeout(timer);
  }, [selectedCategory, selectedDietary, selectedAvailability, searchQuery]);

  // Dish actions
  const handleOpenAdd = () => {
    setEditingDish(null);
    setIsDishModalOpen(true);
  };

  const handleOpenEdit = (dish) => {
    setEditingDish(dish);
    setIsDishModalOpen(true);
  };

  const handleSaveDish = async (payload, id) => {
    if (id) {
      await updateDish(id, payload);
      toast.success(`"${payload.name}" updated!`);
    } else {
      await createDish(payload);
      toast.success(`"${payload.name}" added to menu!`);
    }
    // Refresh both dishes & stats
    fetchDishes();
    getMenuStats().then(setStats);
    getCategories().then(setCategories);
  };

  const handleToggleAvailability = async (id, newAvailable) => {
    try {
      // Optimistic update
      setDishes((prev) =>
        prev.map((d) => (d.id === id ? { ...d, available: newAvailable } : d))
      );
      await toggleDishAvailability(id, newAvailable);
      toast.success(`Status updated to ${newAvailable ? 'In Stock' : 'Out of Stock'}`);
      getMenuStats().then(setStats);
    } catch (err) {
      toast.error('Failed to update availability');
      fetchDishes(); // Rollback
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingDish) return;
    try {
      await deleteDish(deletingDish.id);
      toast.success(`"${deletingDish.name}" deleted`);
      setDeletingDish(null);
      fetchDishes();
      getMenuStats().then(setStats);
      getCategories().then(setCategories);
    } catch (err) {
      console.error('Failed to delete dish:', err);
      toast.error('Failed to delete dish');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-dark-900 tracking-tight">
            Menu & Dish Management
          </h1>
          <p className="text-xs text-dark-400 mt-1">
            Manage food catalog, categories, pricing, images and real-time stock availability
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dark-200 bg-white hover:bg-dark-50 text-dark-700 text-xs font-semibold shadow-sm transition-all"
          >
            <HiOutlineFolder className="w-4 h-4 text-primary-500" />
            <span>Manage Categories</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="btn-primary flex items-center gap-2 text-xs py-2.5 px-4"
          >
            <HiOutlinePlus className="w-4 h-4" />
            <span>Add New Dish</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Bar */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-3.5 rounded-xl border border-dark-100 shadow-sm">
            <p className="text-[11px] font-semibold text-dark-400 uppercase">Total Dishes</p>
            <p className="text-xl font-bold text-dark-900 mt-0.5">{stats.totalDishes}</p>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-dark-100 shadow-sm">
            <p className="text-[11px] font-semibold text-emerald-600 uppercase">In Stock</p>
            <p className="text-xl font-bold text-emerald-700 mt-0.5">{stats.inStockDishes}</p>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-dark-100 shadow-sm">
            <p className="text-[11px] font-semibold text-red-500 uppercase">Out of Stock</p>
            <p className="text-xl font-bold text-red-600 mt-0.5">{stats.outOfStockDishes}</p>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-dark-100 shadow-sm">
            <p className="text-[11px] font-semibold text-dark-400 uppercase">Categories</p>
            <p className="text-xl font-bold text-dark-900 mt-0.5">{stats.totalCategories}</p>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-dark-100 shadow-sm">
            <p className="text-[11px] font-semibold text-emerald-700 uppercase">Veg Items</p>
            <p className="text-xl font-bold text-emerald-800 mt-0.5">{stats.vegDishes}</p>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-dark-100 shadow-sm">
            <p className="text-[11px] font-semibold text-red-700 uppercase">Non-Veg Items</p>
            <p className="text-xl font-bold text-red-800 mt-0.5">{stats.nonVegDishes}</p>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="card p-4 space-y-4">
        {/* Search & Select dropdowns */}
        <div className="flex flex-col md:flex-row gap-3 items-center">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-dark-400">
              <HiOutlineSearch className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by dish name, description, ingredients..."
              className="input-field pl-10 text-xs py-2.5"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-dark-400 hover:text-dark-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Dietary Filter */}
          <div className="w-full md:w-44">
            <select
              value={selectedDietary}
              onChange={(e) => setSelectedDietary(e.target.value)}
              className="input-field text-xs py-2.5"
            >
              <option value="ALL">All Dietary Types</option>
              <option value="VEG">Vegetarian Only</option>
              <option value="NON_VEG">Non-Vegetarian Only</option>
              <option value="VEGAN">Vegan Only</option>
            </select>
          </div>

          {/* Availability Filter */}
          <div className="w-full md:w-44">
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="input-field text-xs py-2.5"
            >
              <option value="ALL">All Stock Statuses</option>
              <option value="IN_STOCK">In Stock Only</option>
              <option value="OUT_OF_STOCK">Out of Stock Only</option>
            </select>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-dark-100/80">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'ALL'
                ? 'bg-primary-500 text-white shadow-sm'
                : 'bg-dark-100 text-dark-600 hover:bg-dark-200'
            }`}
          >
            All Categories ({stats?.totalDishes || dishes.length})
          </button>

          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id.toString())}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === c.id.toString()
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'bg-dark-100 text-dark-600 hover:bg-dark-200'
              }`}
            >
              {c.name} ({c.dishCount})
            </button>
          ))}
        </div>
      </div>

      {/* Dishes Grid */}
      {loading ? (
        <div className="p-12 text-center">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-dark-400 font-semibold">Loading menu dishes...</p>
        </div>
      ) : dishes.length === 0 ? (
        <div className="card p-12 text-center max-w-md mx-auto">
          <HiOutlineExclamation className="w-12 h-12 text-dark-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-dark-800 mb-1">No Dishes Found</h3>
          <p className="text-xs text-dark-400 mb-5">
            No dishes match your selected filter criteria. Try resetting filters or adding a new dish.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('ALL');
              setSelectedDietary('ALL');
              setSelectedAvailability('ALL');
              setSearchQuery('');
            }}
            className="btn-secondary text-xs py-2 px-4 inline-flex items-center gap-2"
          >
            <HiOutlineRefresh className="w-4 h-4" />
            <span>Reset Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {dishes.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              onEdit={handleOpenEdit}
              onDelete={setDeletingDish}
              onToggleAvailability={handleToggleAvailability}
            />
          ))}
        </div>
      )}

      {/* Dish Modal (Add / Edit) */}
      <DishModal
        isOpen={isDishModalOpen}
        onClose={() => setIsDishModalOpen(false)}
        onSave={handleSaveDish}
        dish={editingDish}
        categories={categories}
      />

      {/* Category Management Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onRefresh={() => {
          getCategories().then(setCategories);
          getMenuStats().then(setStats);
        }}
      />

      {/* Delete Confirmation Dialog */}
      {deletingDish && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center animate-fadeIn border border-dark-100">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <HiOutlineExclamation className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-dark-900 mb-1">Delete Dish?</h3>
            <p className="text-xs text-dark-500 mb-5">
              Are you sure you want to delete <span className="font-bold text-dark-800">"{deletingDish.name}"</span>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeletingDish(null)}
                className="px-4 py-2 text-xs font-semibold text-dark-600 hover:bg-dark-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

