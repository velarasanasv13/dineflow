import { useState } from 'react';
import { 
  HiOutlinePencilAlt, 
  HiOutlineTrash, 
  HiOutlineClock, 
  HiOutlineFire 
} from 'react-icons/hi';

export default function DishCard({ dish, onEdit, onDelete, onToggleAvailability }) {
  const [toggling, setToggling] = useState(false);

  const handleToggle = async (e) => {
    e.stopPropagation();
    try {
      setToggling(true);
      await onToggleAvailability(dish.id, !dish.available);
    } finally {
      setToggling(false);
    }
  };

  const isVeg = dish.dietaryType === 'VEG' || dish.dietaryType === 'VEGAN';

  return (
    <div className={`card overflow-hidden flex flex-col transition-all duration-200 hover:shadow-lg border ${
      !dish.available ? 'opacity-75 bg-dark-50/50 border-dark-200' : 'border-dark-100 hover:border-primary-300'
    }`}>
      {/* Top Image Container */}
      <div className="relative h-48 w-full bg-dark-100 overflow-hidden group">
        <img
          src={dish.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'}
          alt={dish.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Dietary Badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-md shadow-md flex items-center gap-1.5">
          <span className={`w-3.5 h-3.5 border-2 rounded-sm flex items-center justify-center ${
            isVeg ? 'border-emerald-600' : 'border-red-600'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isVeg ? 'bg-emerald-600' : 'bg-red-600'}`} />
          </span>
          <span className={`text-[11px] font-bold tracking-wider ${isVeg ? 'text-emerald-700' : 'text-red-700'}`}>
            {dish.dietaryType}
          </span>
        </div>

        {/* Category Pill */}
        <div className="absolute top-3 right-3 bg-dark-900/80 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-full text-xs font-medium">
          {dish.categoryName || 'General'}
        </div>

        {/* Price & Prep Time overlay at bottom of image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
          <div className="text-xl font-extrabold drop-shadow-md">
            ₹{dish.price?.toFixed(2)}
          </div>
          {dish.prepTimeMinutes && (
            <div className="flex items-center gap-1 text-xs bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded text-dark-200">
              <HiOutlineClock className="w-3.5 h-3.5" />
              <span>{dish.prepTimeMinutes} mins</span>
            </div>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-dark-900 text-base leading-snug line-clamp-1">
              {dish.name}
            </h3>
            {dish.spicyLevel > 0 && (
              <div className="flex items-center text-red-500" title={`Spiciness: ${dish.spicyLevel}/3`}>
                {[...Array(dish.spicyLevel)].map((_, i) => (
                  <HiOutlineFire key={i} className="w-4 h-4 fill-red-500 text-red-500 -ml-1" />
                ))}
              </div>
            )}
          </div>

          <p className="text-xs text-dark-500 line-clamp-2 leading-relaxed mb-3">
            {dish.description || 'No description provided.'}
          </p>
        </div>

        {/* Footer: Availability Toggle & Action Buttons */}
        <div className="pt-3 border-t border-dark-100 flex items-center justify-between gap-2">
          {/* Availability Toggle Switch */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <button
              type="button"
              role="switch"
              aria-checked={dish.available}
              disabled={toggling}
              onClick={handleToggle}
              className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                dish.available ? 'bg-emerald-500' : 'bg-dark-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  dish.available ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-xs font-semibold ${dish.available ? 'text-emerald-700' : 'text-dark-400'}`}>
              {dish.available ? 'In Stock' : 'Out of Stock'}
            </span>
          </label>

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(dish)}
              className="p-1.5 text-dark-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title="Edit Dish"
            >
              <HiOutlinePencilAlt className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(dish)}
              className="p-1.5 text-dark-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Dish"
            >
              <HiOutlineTrash className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

