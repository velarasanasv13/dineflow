import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { placeOrder } from '../api/orders';
import { 
  HiOutlineArrowLeft, 
  HiOutlineTrash, 
  HiOutlinePlus, 
  HiOutlineMinus,
  HiOutlineUser,
  HiOutlineChatAlt2,
  HiOutlineShieldCheck
} from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function CustomerCart() {
  const { tableNumber } = useParams();
  const navigate = useNavigate();
  const {
    sessionId,
    customerName,
    setCustomerName,
    itemsList,
    addToCart,
    decrementItem,
    removeFromCart,
    updateNotes,
    clearCart,
    cartSubtotal,
    gstAmount,
    grandTotal,
    cartCount,
  } = useCart();

  const [name, setName] = useState(customerName || '');
  const [instructions, setInstructions] = useState('');
  const [isPlacing, setIsPlacing] = useState(false);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your name so we can identify your dishes');
      return;
    }
    if (itemsList.length === 0) {
      toast.error('Your cart is empty. Please add dishes from the menu.');
      return;
    }

    setCustomerName(name.trim());

    try {
      setIsPlacing(true);

      const payload = {
        tableNumber: tableNumber.trim(),
        customerName: name.trim(),
        customerSessionId: sessionId,
        specialInstructions: instructions.trim(),
        items: itemsList.map((item) => ({
          dishId: item.dish.id,
          quantity: item.quantity,
          specialNotes: item.specialNotes || '',
        })),
      };

      const order = await placeOrder(payload);
      toast.success('🎉 Order placed successfully!');
      clearCart();

      // Navigate to order tracking page
      navigate(`/order/track/${order.orderNumber}`);
    } catch (err) {
      console.error('Failed to place order:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to place order';
      toast.error(msg);
    } finally {
      setIsPlacing(false);
    }
  };

  if (itemsList.length === 0) {
    return (
      <div className="min-h-screen bg-dark-50 p-4 flex flex-col justify-between max-w-lg mx-auto">
        <div>
          <button
            onClick={() => navigate(`/table/${tableNumber}`)}
            className="flex items-center gap-1.5 text-xs font-bold text-dark-600 hover:text-dark-900 py-3"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            <span>Back to Menu (Table {tableNumber})</span>
          </button>

          <div className="card p-12 text-center mt-8">
            <div className="w-16 h-16 rounded-full bg-dark-100 flex items-center justify-center mx-auto mb-4 text-2xl">
              🛒
            </div>
            <h2 className="text-lg font-bold text-dark-900">Your Cart is Empty</h2>
            <p className="text-xs text-dark-400 mt-1 mb-6">
              You haven't added any dishes yet from Table {tableNumber}'s menu.
            </p>
            <button
              onClick={() => navigate(`/table/${tableNumber}`)}
              className="btn-primary text-xs py-2.5 px-6 inline-flex"
            >
              Browse Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-50 pb-20 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-dark-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(`/table/${tableNumber}`)}
            className="flex items-center gap-2 text-xs font-bold text-dark-700 hover:text-dark-900"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            <span>Menu</span>
          </button>

          <div className="text-center">
            <h1 className="font-bold text-dark-900 text-sm">Review & Place Order</h1>
            <p className="text-[11px] text-primary-600 font-extrabold">Table {tableNumber}</p>
          </div>

          <button
            onClick={clearCart}
            className="text-xs font-semibold text-red-600 hover:text-red-700"
          >
            Clear
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* Customer Identity Card */}
        <div className="card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-dark-700 flex items-center gap-1.5">
              <HiOutlineUser className="w-4 h-4 text-primary-500" />
              <span>Ordering As (Your Name) *</span>
            </label>
            <span className="text-[11px] text-dark-400">No login required</span>
          </div>

          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name (e.g. Rahul)"
            className="input-field text-sm font-semibold py-2.5"
          />
          <p className="text-[11px] text-dark-400">
            Others at Table {tableNumber} can order with their own names at the same time.
          </p>
        </div>

        {/* Selected Dishes List */}
        <div className="card p-4 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-dark-500">
            Order Items ({cartCount})
          </h2>

          <div className="divide-y divide-dark-100">
            {itemsList.map(({ dish, quantity, specialNotes }) => {
              const isVeg = dish.dietaryType === 'VEG' || dish.dietaryType === 'VEGAN';
              const itemTotal = dish.price * quantity;

              return (
                <div key={dish.id} className="py-3.5 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      <span className={`w-3.5 h-3.5 mt-0.5 border-2 rounded-sm flex items-center justify-center flex-shrink-0 ${
                        isVeg ? 'border-emerald-600' : 'border-red-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isVeg ? 'bg-emerald-600' : 'bg-red-600'}`} />
                      </span>

                      <div className="min-w-0">
                        <p className="text-sm font-bold text-dark-900 leading-snug">{dish.name}</p>
                        <p className="text-xs text-dark-400 mt-0.5">₹{dish.price?.toFixed(2)} each</p>
                      </div>
                    </div>

                    {/* Stepper & Total */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-dark-100 rounded-lg px-2 py-1">
                        <button
                          onClick={() => decrementItem(dish.id)}
                          className="p-0.5 text-dark-600 hover:text-dark-900"
                        >
                          <HiOutlineMinus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-dark-900">
                          {quantity}
                        </span>
                        <button
                          onClick={() => addToCart(dish)}
                          className="p-0.5 text-dark-600 hover:text-dark-900"
                        >
                          <HiOutlinePlus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-dark-900 w-16 text-right">
                        ₹{itemTotal.toFixed(2)}
                      </span>

                      <button
                        onClick={() => removeFromCart(dish.id)}
                        className="text-dark-400 hover:text-red-500 p-1"
                        title="Remove"
                      >
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Optional Dish Notes */}
                  <input
                    type="text"
                    value={specialNotes || ''}
                    onChange={(e) => updateNotes(dish.id, e.target.value)}
                    placeholder="Special request (e.g. less spicy, no onions)..."
                    className="w-full px-3 py-1.5 text-xs bg-dark-50 rounded-lg border border-dark-200/60 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-400 text-dark-700"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Cooking Notes */}
        <div className="card p-4 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-dark-700 flex items-center gap-1.5">
            <HiOutlineChatAlt2 className="w-4 h-4 text-primary-500" />
            <span>Kitchen Instructions (Optional)</span>
          </label>
          <textarea
            rows={2}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="e.g. Please bring drinks with the starters, extra tissues on table..."
            className="input-field text-xs resize-none"
          />
        </div>

        {/* Bill Summary */}
        <div className="card p-4 space-y-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-dark-500 mb-2">
            Payment Breakdown
          </h2>

          <div className="flex items-center justify-between text-xs text-dark-600">
            <span>Item Subtotal</span>
            <span>₹{cartSubtotal.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-dark-600">
            <span>Taxes & GST (5%)</span>
            <span>₹{gstAmount.toFixed(2)}</span>
          </div>

          <div className="pt-2 border-t border-dark-100 flex items-center justify-between text-base font-extrabold text-dark-900">
            <span>Total Amount</span>
            <span className="text-primary-600">₹{grandTotal.toFixed(2)}</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-dark-400 pt-1">
            <HiOutlineShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Pay later at your table or counter when dining completes.</span>
          </div>
        </div>

        {/* Submit Order Button */}
        <div className="pt-2">
          <button
            onClick={handlePlaceOrder}
            disabled={isPlacing || itemsList.length === 0}
            className="w-full btn-primary text-sm py-4 rounded-2xl shadow-xl shadow-primary-500/25 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isPlacing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Sending to Kitchen...</span>
              </>
            ) : (
              <span>Confirm & Send Order to Kitchen (₹{grandTotal.toFixed(2)})</span>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}

