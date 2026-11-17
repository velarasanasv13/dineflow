import { useState, useEffect } from 'react'
import { getAllOrders } from '../api/adminOrders'
import { getBillByOrderId, markBillPaid } from '../api/billing'

export default function AdminBilling() {
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [bill, setBill] = useState(null)
  const [loading, setLoading] = useState(true)
  const [billLoading, setBillLoading] = useState(false)
  const [processingPay, setProcessingPay] = useState(false)
  const [search, setSearch] = useState('')

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await getAllOrders()
      setOrders(res.data.data || [])
    } catch (err) {
      console.error('Failed to load orders for billing', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const loadBill = async (order) => {
    setSelectedOrder(order)
    setBillLoading(true)
    try {
      const res = await getBillByOrderId(order.id)
      setBill(res.data.data)
    } catch (err) {
      console.error('Failed to fetch bill', err)
    } finally {
      setBillLoading(false)
    }
  }

  const handlePay = async () => {
    if (!selectedOrder) return
    setProcessingPay(true)
    try {
      const res = await markBillPaid(selectedOrder.id)
      setBill(res.data.data)
      await fetchOrders()
    } catch (err) {
      console.error('Payment error', err)
    } finally {
      setProcessingPay(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const filteredOrders = orders.filter((o) => {
    const q = search.toLowerCase()
    return (
      !q ||
      o.orderNumber?.toLowerCase().includes(q) ||
      o.customerName?.toLowerCase().includes(q) ||
      o.tableNumber?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">💳 Billing & Settlement</h1>
          <p className="text-sm text-gray-500">Tax invoices (5% GST), order settlements and receipt printouts</p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search order, customer, table..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-orange-300 outline-none w-64"
          />
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h2 className="font-semibold text-gray-800 text-sm">Select Order to View Bill</h2>
            <span className="text-xs text-gray-500">{filteredOrders.length} orders found</span>
          </div>

          <div className="divide-y divide-gray-100 max-h-[650px] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-400">Loading orders...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No orders found.</div>
            ) : (
              filteredOrders.map((o) => {
                const isSelected = selectedOrder?.id === o.id
                return (
                  <div
                    key={o.id}
                    onClick={() => loadBill(o)}
                    className={`p-4 hover:bg-orange-50/60 cursor-pointer transition flex items-center justify-between ${
                      isSelected ? 'bg-orange-50/90 border-l-4 border-orange-500' : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm">{o.orderNumber}</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">
                          Table {o.tableNumber}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                            o.paymentStatus === 'PAID'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {o.paymentStatus}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        👤 {o.customerName} &bull; {o.items?.length || 0} items &bull;{' '}
                        {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="font-extrabold text-gray-900">₹{Number(o.totalAmount).toFixed(2)}</div>
                      <span className="text-[11px] text-gray-400">Excl. GST</span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Invoice / Receipt View */}
        <div className="lg:col-span-5">
          {billLoading ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-gray-400">
              Generating tax bill...
            </div>
          ) : bill ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6" id="printable-bill">
              {/* Receipt Header */}
              <div className="text-center pb-4 border-b border-dashed border-gray-300">
                <span className="text-3xl">🍽️</span>
                <h3 className="font-extrabold text-xl text-gray-900 tracking-tight mt-1">DineFlow Restaurant</h3>
                <p className="text-xs text-gray-500">GSTIN: 33AAACD1234F1Z8</p>
                <p className="text-xs text-gray-400">123 Culinary Avenue, Food City</p>
                <div className="mt-3 inline-block bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full font-bold">
                  TAX INVOICE
                </div>
              </div>

              {/* Order Meta */}
              <div className="text-xs text-gray-600 space-y-1 pb-3 border-b border-gray-100">
                <div className="flex justify-between">
                  <span>Invoice / Order:</span>
                  <span className="font-bold text-gray-900">{bill.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Table No:</span>
                  <span className="font-bold text-gray-900">{bill.tableNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span className="font-semibold text-gray-800">{bill.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Status:</span>
                  <span
                    className={`font-bold ${
                      bill.paymentStatus === 'PAID' ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {bill.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Line Items */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex justify-between pb-1 border-b">
                  <span>Item</span>
                  <div className="space-x-6">
                    <span>Qty</span>
                    <span>Amt</span>
                  </div>
                </div>

                {bill.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs text-gray-700">
                    <span className="truncate max-w-[160px]">{item.dishName}</span>
                    <div className="space-x-8">
                      <span className="text-gray-500">x{item.quantity}</span>
                      <span className="font-medium text-gray-900">₹{Number(item.subtotal).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals Breakdown */}
              <div className="pt-4 border-t border-dashed border-gray-300 space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>₹{Number(bill.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>CGST (2.5%):</span>
                  <span>₹{(Number(bill.gstAmount) / 2).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>SGST (2.5%):</span>
                  <span>₹{(Number(bill.gstAmount) / 2).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Grand Total (incl. GST):</span>
                  <span className="text-orange-600">₹{Number(bill.grandTotal).toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-3 print:hidden">
                {bill.paymentStatus !== 'PAID' ? (
                  <button
                    onClick={handlePay}
                    disabled={processingPay}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-sm transition shadow-md"
                  >
                    {processingPay ? 'Processing...' : 'Mark Paid (Collect)'}
                  </button>
                ) : (
                  <div className="flex-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-center py-2 rounded-xl text-xs font-bold">
                    ✓ Paid &amp; Settled
                  </div>
                )}
                <button
                  onClick={handlePrint}
                  className="px-4 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-sm font-semibold transition"
                >
                  🖨️ Print
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-dashed border-gray-200 p-12 text-center text-gray-400">
              Select an order on the left to review bill, calculate GST, and record payment.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

