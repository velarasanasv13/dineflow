import api from './axios'

export const getKitchenOrders = () => api.get('/admin/kitchen/orders')
export const getKitchenStats  = () => api.get('/admin/kitchen/stats')

export const updateOrderStatus = (orderId, status) =>
  api.patch(`/admin/kitchen/orders/${orderId}/status`, { status })

export const updateItemStatus = (itemId, itemStatus) =>
  api.patch(`/admin/kitchen/items/${itemId}/status`, { itemStatus })

