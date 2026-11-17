import { useState, useEffect } from 'react';
import { HiOutlineX, HiOutlineUpload, HiOutlinePhotograph, HiOutlineFire } from 'react-icons/hi';
import { uploadImage } from '../api/menu';
import toast from 'react-hot-toast';

export default function DishModal({ isOpen, onClose, onSave, dish, categories }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    available: true,
    dietaryType: 'VEG',
    categoryId: '',
    prepTimeMinutes: 15,
    spicyLevel: 1,
    featured: false,
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (dish) {
      setFormData({
        name: dish.name || '',
        description: dish.description || '',
        price: dish.price?.toString() || '',
        imageUrl: dish.imageUrl || '',
        available: dish.available !== undefined ? dish.available : true,
        dietaryType: dish.dietaryType || 'VEG',
        categoryId: dish.categoryId?.toString() || (categories[0]?.id?.toString() || ''),
        prepTimeMinutes: dish.prepTimeMinutes || 15,
        spicyLevel: dish.spicyLevel !== undefined ? dish.spicyLevel : 1,
        featured: dish.featured || false,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        available: true,
        dietaryType: 'VEG',
        categoryId: categories[0]?.id?.toString() || '',
        prepTimeMinutes: 15,
        spicyLevel: 1,
        featured: false,
      });
    }
  }, [dish, categories, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    try {
      setUploading(true);
      const url = await uploadImage(file);
      setFormData((prev) => ({ ...prev, imageUrl: url }));
      toast.success('Image uploaded successfully!');
    } catch (err) {
      console.error('File upload failed:', err);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Dish name is required');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }
    if (!formData.categoryId) {
      toast.error('Please select a category');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        imageUrl: formData.imageUrl.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
        available: formData.available,
        dietaryType: formData.dietaryType,
        categoryId: parseInt(formData.categoryId, 10),
        prepTimeMinutes: parseInt(formData.prepTimeMinutes, 10) || 15,
        spicyLevel: parseInt(formData.spicyLevel, 10) || 0,
        featured: formData.featured,
      };

      await onSave(payload, dish?.id);
      onClose();
    } catch (err) {
      console.error('Save dish error:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to save dish';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-dark-100 overflow-hidden transform transition-all animate-fadeIn">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-dark-100 flex items-center justify-between bg-dark-50/50">
          <div>
            <h2 className="text-lg font-bold text-dark-900">
              {dish ? 'Edit Dish Details' : 'Add New Dish to Menu'}
            </h2>
            <p className="text-xs text-dark-400">
              {dish ? 'Update pricing, availability, and description' : 'Enter recipe, category and pricing details'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-dark-400 hover:text-dark-700 hover:bg-dark-100 transition-colors"
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Row 1: Name & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-dark-600 mb-1.5">
                Dish Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Paneer Butter Masala"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-dark-600 mb-1.5">
                Category *
              </label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="input-field"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Price & Dietary Type & Prep Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-dark-600 mb-1.5">
                Price (₹) *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-dark-400 font-semibold text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="250.00"
                  className="input-field pl-8"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-dark-600 mb-1.5">
                Dietary Type *
              </label>
              <div className="grid grid-cols-3 gap-1 bg-dark-100 p-1 rounded-lg">
                {['VEG', 'NON_VEG', 'VEGAN'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, dietaryType: type })}
                    className={`py-1.5 text-xs font-bold rounded transition-all ${
                      formData.dietaryType === type
                        ? type === 'VEG'
                          ? 'bg-emerald-600 text-white shadow'
                          : type === 'NON_VEG'
                          ? 'bg-red-600 text-white shadow'
                          : 'bg-green-700 text-white shadow'
                        : 'text-dark-600 hover:text-dark-900'
                    }`}
                  >
                    {type === 'NON_VEG' ? 'Non-Veg' : type === 'VEG' ? 'Veg' : 'Vegan'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-dark-600 mb-1.5">
                Prep Time (Mins)
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={formData.prepTimeMinutes}
                onChange={(e) => setFormData({ ...formData, prepTimeMinutes: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          {/* Row 3: Spicy Level & Availability & Featured */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-dark-50 rounded-xl border border-dark-100">
            <div>
              <label className="block text-xs font-semibold uppercase text-dark-600 mb-1.5">
                Spiciness Level
              </label>
              <div className="flex items-center gap-2">
                {[0, 1, 2, 3].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData({ ...formData, spicyLevel: level })}
                    className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
                      formData.spicyLevel === level
                        ? 'bg-red-500 text-white border-red-500 shadow-sm'
                        : 'border-dark-200 text-dark-600 hover:bg-dark-100'
                    }`}
                  >
                    {level === 0 ? 'None' : `${level} 🔥`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-dark-600 mb-1.5">
                Stock Status
              </label>
              <label className="inline-flex items-center gap-2.5 cursor-pointer mt-1">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-dark-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-dark-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 relative" />
                <span className={`text-xs font-bold ${formData.available ? 'text-emerald-700' : 'text-dark-500'}`}>
                  {formData.available ? 'In Stock (Active)' : 'Out of Stock'}
                </span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-dark-600 mb-1.5">
                Chef's Special
              </label>
              <label className="inline-flex items-center gap-2.5 cursor-pointer mt-1">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-dark-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-dark-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-500 relative" />
                <span className={`text-xs font-bold ${formData.featured ? 'text-primary-700' : 'text-dark-500'}`}>
                  {formData.featured ? 'Featured Item' : 'Regular'}
                </span>
              </label>
            </div>
          </div>

          {/* Row 4: Image input & File Upload */}
          <div>
            <label className="block text-xs font-semibold uppercase text-dark-600 mb-1.5">
              Dish Image URL or File Upload
            </label>
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="relative flex-1 w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-dark-400">
                  <HiOutlinePhotograph className="w-5 h-5" />
                </div>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/... or upload below"
                  className="input-field pl-10 text-xs"
                />
              </div>

              <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-dark-100 hover:bg-dark-200 text-dark-700 rounded-lg cursor-pointer transition-colors text-xs font-semibold border border-dark-200">
                <HiOutlineUpload className="w-4 h-4 text-dark-500" />
                <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            {/* Image Preview */}
            {formData.imageUrl && (
              <div className="mt-3 flex items-center gap-3 p-2 bg-dark-50 rounded-xl border border-dark-200/60 max-w-md">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-14 h-14 rounded-lg object-cover border border-dark-200"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="overflow-hidden">
                  <p className="text-xs font-medium text-dark-700 truncate">{formData.imageUrl}</p>
                  <p className="text-[11px] text-emerald-600 font-semibold">Live image preview active</p>
                </div>
              </div>
            )}
          </div>

          {/* Row 5: Description */}
          <div>
            <label className="block text-xs font-semibold uppercase text-dark-600 mb-1.5">
              Description & Ingredients
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="A brief description of flavor profile, cooking technique, and key ingredients..."
              className="input-field resize-none text-xs leading-relaxed"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-dark-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2.5 text-xs font-semibold text-dark-600 hover:text-dark-800 hover:bg-dark-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="btn-primary text-xs py-2.5 px-6 flex items-center gap-2"
            >
              {saving && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              <span>{dish ? 'Save Changes' : 'Create Dish'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

