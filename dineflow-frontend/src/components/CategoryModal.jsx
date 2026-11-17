import { useState } from 'react';
import { HiOutlineX, HiOutlinePlus, HiOutlineTrash, HiOutlineCheck } from 'react-icons/hi';
import { createCategory, deleteCategory } from '../api/menu';
import toast from 'react-hot-toast';

export default function CategoryModal({ isOpen, onClose, categories, onRefresh }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState('1');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      setLoading(true);
      await createCategory({
        name: name.trim(),
        description: description.trim(),
        displayOrder: parseInt(displayOrder, 10) || 0,
        active: true,
      });
      toast.success(`Category "${name}" created!`);
      setName('');
      setDescription('');
      setDisplayOrder('1');
      onRefresh();
    } catch (err) {
      console.error('Failed to create category:', err);
      toast.error(err.response?.data?.message || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cat) => {
    if (cat.dishCount > 0) {
      toast.error(`Cannot delete "${cat.name}" because it contains ${cat.dishCount} dishes.`);
      return;
    }
    if (!window.confirm(`Delete empty category "${cat.name}"?`)) return;

    try {
      await deleteCategory(cat.id);
      toast.success(`Category "${cat.name}" deleted.`);
      onRefresh();
    } catch (err) {
      console.error('Failed to delete category:', err);
      toast.error(err.response?.data?.message || 'Failed to delete category');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-dark-100 overflow-hidden transform transition-all animate-fadeIn">
        {/* Header */}
        <div className="px-6 py-4 border-b border-dark-100 flex items-center justify-between bg-dark-50/50">
          <div>
            <h2 className="text-lg font-bold text-dark-900">Manage Menu Categories</h2>
            <p className="text-xs text-dark-400">Add or organize categories (Starters, Mains, Desserts...)</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-dark-400 hover:text-dark-700 hover:bg-dark-100 transition-colors"
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Add Category Form */}
          <form onSubmit={handleAdd} className="bg-dark-50 p-4 rounded-xl border border-dark-200/80 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-dark-700">Add New Category</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Category Name (e.g. Breads)"
                  className="input-field text-xs py-2"
                />
              </div>
              <div>
                <input
                  type="number"
                  min="0"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                  placeholder="Order"
                  title="Display Sort Order"
                  className="input-field text-xs py-2 text-center"
                />
              </div>
            </div>

            <div>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description (optional)"
                className="input-field text-xs py-2"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary text-xs py-2 px-4 w-full flex items-center justify-center gap-1.5"
            >
              <HiOutlinePlus className="w-4 h-4" />
              <span>{loading ? 'Adding...' : 'Add Category'}</span>
            </button>
          </form>

          {/* Existing Categories List */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-dark-500 mb-3">
              Existing Categories ({categories.length})
            </h3>
            <div className="divide-y divide-dark-100 border border-dark-100 rounded-xl overflow-hidden bg-white">
              {categories.map((c) => (
                <div key={c.id} className="p-3 flex items-center justify-between hover:bg-dark-50/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-primary-100 text-primary-700 font-bold text-xs flex items-center justify-center">
                      {c.displayOrder}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-dark-900 leading-tight">{c.name}</p>
                      <p className="text-[11px] text-dark-400">
                        {c.dishCount} {c.dishCount === 1 ? 'dish' : 'dishes'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                      Active
                    </span>
                    <button
                      onClick={() => handleDelete(c)}
                      className={`p-1.5 rounded-lg text-dark-400 hover:text-red-600 hover:bg-red-50 transition-colors ${
                        c.dishCount > 0 ? 'opacity-40 cursor-not-allowed' : ''
                      }`}
                      title={c.dishCount > 0 ? 'Category has dishes; delete dishes first' : 'Delete Category'}
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-dark-100 bg-dark-50 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-dark-600 hover:text-dark-900 rounded-lg hover:bg-dark-100 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

