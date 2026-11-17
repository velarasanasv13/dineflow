import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const CartContext = createContext(null);

function getOrCreateSessionId() {
  let id = localStorage.getItem('dineflow_customer_session_id');
  if (!id) {
    id = 'sess-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now();
    localStorage.setItem('dineflow_customer_session_id', id);
  }
  return id;
}

export function CartProvider({ children }) {
  const [sessionId] = useState(getOrCreateSessionId);
  const [customerName, setCustomerNameState] = useState(() => {
    return localStorage.getItem('dineflow_customer_name') || '';
  });
  const [currentTableNumber, setCurrentTableNumber] = useState(() => {
    return localStorage.getItem('dineflow_current_table') || '';
  });

  // Cart items: { [dishId]: { dish, quantity, specialNotes } }
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('dineflow_cart');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('dineflow_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const setCustomerName = (name) => {
    const trimmed = name.trim();
    setCustomerNameState(trimmed);
    localStorage.setItem('dineflow_customer_name', trimmed);
  };

  const setTableNumber = (tableNum) => {
    setCurrentTableNumber(tableNum);
    localStorage.setItem('dineflow_current_table', tableNum);
  };

  const addToCart = (dish) => {
    setCartItems((prev) => {
      const existing = prev[dish.id];
      if (existing) {
        return {
          ...prev,
          [dish.id]: {
            ...existing,
            quantity: existing.quantity + 1,
          },
        };
      }
      return {
        ...prev,
        [dish.id]: {
          dish,
          quantity: 1,
          specialNotes: '',
        },
      };
    });
  };

  const decrementItem = (dishId) => {
    setCartItems((prev) => {
      const existing = prev[dishId];
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        const copy = { ...prev };
        delete copy[dishId];
        return copy;
      }
      return {
        ...prev,
        [dishId]: {
          ...existing,
          quantity: existing.quantity - 1,
        },
      };
    });
  };

  const removeFromCart = (dishId) => {
    setCartItems((prev) => {
      const copy = { ...prev };
      delete copy[dishId];
      return copy;
    });
  };

  const updateNotes = (dishId, notes) => {
    setCartItems((prev) => {
      if (!prev[dishId]) return prev;
      return {
        ...prev,
        [dishId]: {
          ...prev[dishId],
          specialNotes: notes,
        },
      };
    });
  };

  const clearCart = () => {
    setCartItems({});
    localStorage.removeItem('dineflow_cart');
  };

  const getItemQuantity = (dishId) => {
    return cartItems[dishId]?.quantity || 0;
  };

  const itemsList = useMemo(() => Object.values(cartItems), [cartItems]);

  const cartCount = useMemo(() => {
    return itemsList.reduce((sum, item) => sum + item.quantity, 0);
  }, [itemsList]);

  const cartSubtotal = useMemo(() => {
    return itemsList.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
  }, [itemsList]);

  const gstAmount = useMemo(() => {
    return Math.round(cartSubtotal * 0.05 * 100) / 100; // 5% GST (2.5% CGST + 2.5% SGST)
  }, [cartSubtotal]);

  const grandTotal = useMemo(() => {
    return Math.round((cartSubtotal + gstAmount) * 100) / 100;
  }, [cartSubtotal, gstAmount]);

  return (
    <CartContext.Provider
      value={{
        sessionId,
        customerName,
        setCustomerName,
        currentTableNumber,
        setTableNumber,
        cartItems,
        itemsList,
        addToCart,
        decrementItem,
        removeFromCart,
        updateNotes,
        clearCart,
        getItemQuantity,
        cartCount,
        cartSubtotal,
        gstAmount,
        grandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

