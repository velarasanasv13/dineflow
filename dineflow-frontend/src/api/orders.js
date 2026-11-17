import api from './axios';

// Customer Public APIs (no login required)
export const placeOrder = async (orderPayload) => {
  const res = await api.post('/orders', orderPayload);
  return res.data.data;
};

export const trackOrder = async (orderNumber) => {
  const res = await api.get(`/orders/track/${orderNumber}`);
  return res.data.data;
};

export const getCustomerSessionOrders = async (sessionId) => {
  const res = await api.get(`/orders/session/${sessionId}`);
  return res.data.data;
};

export const getActiveTableOrders = async (tableNumber) => {
  const res = await api.get(`/orders/table/${tableNumber}`);
  return res.data.data;
};

// Admin APIs
export const getAllOrders = async (status = null) => {
  const query = status ? `?status=${status}` : '';
  const res = await api.get(`/admin/orders${query}`);
  return res.data.data;
};

export const updateOrderStatus = async (orderId, updatePayload) => {
  const res = await api.patch(`/admin/orders/${orderId}/status`, updatePayload);
  return res.data.data;
};

