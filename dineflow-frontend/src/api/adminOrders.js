import api from './axios'

export const getAllOrders = (params) => api.get('/admin/orders', { params })
export const updateOrderStatus = (orderId, payload) =>
  api.patch(`/admin/orders/${orderId}/status`, payload)

