import api from './axios'

export const getBillByOrderId = (orderId) => api.get(`/admin/billing/order/${orderId}`)
export const getBillByOrderNumber = (orderNumber) => api.get(`/admin/billing/order/number/${orderNumber}`)
export const markBillPaid = (orderId) => api.patch(`/admin/billing/order/${orderId}/pay`)
export const getSummaryReport = () => api.get('/admin/reports/summary')

