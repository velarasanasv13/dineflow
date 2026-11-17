import { useState, useEffect, useCallback } from 'react'
import { getAllOrders, updateOrderStatus } from '../api/adminOrders'

const STATUS_OPTIONS = ['ALL', 'PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'SERVED', 'COMPLETED', 'CANCELLED']

const STATUS_BADGE = {
  PENDING:   'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100   text-blue-800',
  PREPARING: 'bg-orange-100 text-orange-800',
  READY:     'bg-green-100  text-green-800',
  SERVED:    'bg-purple-100 text-purple-800',
  COMPLETED: 'bg-gray-100   text-gray-700',
  CANCELLED: 'bg-red-100    text-red-800',
}

const PAYMENT_BADGE = {
  UNPAID: 'bg-red-100 text-red-700',
  PAID:   'bg-green-100 text-green-700',
}

function fmt(dt) {
  if (!dt) return '-'
  return new Date(dt).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function AdminOrders() {
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [tableFilter,  setTableFilter]  = useState('')
  const [expanded, setExpanded] = useState(null)
  const [busy, setBusy] = useState({})

  const load = useCallback(async () => {
    try {
      const res = await getAllOrders(statusFilter !== 'ALL' ? { status: statusFilter } : {})
      setOrders(res.data.data || [])
    } catch (e) {
      console.error('Orders load error', e)
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => { load() }, [load])

  const handleStatus = async (orderId, status, paymentStatus) => {
    setBusy(b => ({ ...b, [orderId]: true }))
    try {
      await updateOrderStatus(orderId, { status, paymentStatus })
      await load()
    } finally {
      setBusy(b => { const n = { ...b }; delete n[orderId]; return n })
    }
  }

  const filtered = orders.filter(o => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      o.orderNumber?.toLowerCase().includes(q) ||
      o.customerName?.toLowerCase().includes(q) ||
      o.tableNumber?.toLowerCase().includes(q)
    const matchTable = !tableFilter || o.tableNumber?.toLowerCase().includes(tableFilter.toLowerCase())
    return matchSearch && matchTable
  })

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">📋 Orders Overview</h1>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-48">
          <label className="block text-xs font-medium text-gray-600 mb-1">Search</label>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Order #, customer, table…"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-300 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-300 outline-none"
          >
            {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Table</label>
          <input
            value={tableFilter}
            onChange={e => setTableFilter(e.target.value)}
            placeholder="e.g. T-01"
            className="border rounded-lg px-3 py-2 text-sm w-28 focus:ring-2 focus:ring-orange-300 outline-none"
          />
        </div>
        <button
          onClick={load}
          className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Count */}
      <div className="text-sm text-gray-500 mb-3">
        Showing {filtered.length} of {orders.length} orders
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading orders…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No orders found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Order #', 'Table', 'Customer', 'Items', 'Total', 'Status', 'Payment', 'Time', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(order => (
                <>
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                  >
                    <td className="px-4 py-3 font-mono font-semibold text-gray-900 text-xs">
                      {order.orderNumber}
                    </td>
                    <td className="px-4 py-3 font-medium">{order.tableNumber}</td>
                    <td className="px-4 py-3 text-gray-700">{order.customerName}</td>
                    <td className="px-4 py-3 text-gray-500">{order.items?.length ?? 0}</td>
                    <td className="px-4 py-3 font-semibold">₹{Number(order.totalAmount).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_BADGE[order.status] || 'bg-gray-100 text-gray-700'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${PAYMENT_BADGE[order.paymentStatus] || 'bg-gray-100 text-gray-700'}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{fmt(order.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap" onClick={e => e.stopPropagation()}>
                        {order.status === 'PENDING' && (
                          <QuickBtn label="Confirm" color="blue"
                            busy={busy[order.id]}
                            onClick={() => handleStatus(order.id, 'CONFIRMED')} />
                        )}
                        {order.status === 'CONFIRMED' && (
                          <QuickBtn label="Preparing" color="orange"
                            busy={busy[order.id]}
                            onClick={() => handleStatus(order.id, 'PREPARING')} />
                        )}
                        {order.status === 'READY' && (
                          <QuickBtn label="Served" color="purple"
                            busy={busy[order.id]}
                            onClick={() => handleStatus(order.id, 'SERVED')} />
                        )}
                        {['SERVED', 'READY', 'PREPARING'].includes(order.status) && order.paymentStatus === 'UNPAID' && (
                          <QuickBtn label="Paid ✓" color="green"
                            busy={busy[order.id]}
                            onClick={() => handleStatus(order.id, undefined, 'PAID')} />
                        )}
                        {!['COMPLETED','CANCELLED'].includes(order.status) && (
                          <QuickBtn label="Complete" color="gray"
                            busy={busy[order.id]}
                            onClick={() => handleStatus(order.id, 'COMPLETED')} />
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Expanded items row */}
                  {expanded === order.id && (
                    <tr key={`${order.id}-exp`} className="bg-orange-50">
                      <td colSpan={9} className="px-6 py-4">
                        <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Order Items</div>
                        <div className="space-y-1">
                          {(order.items || []).map(item => (
                            <div key={item.id} className="flex items-center gap-4 text-sm">
                              <span className="font-medium text-gray-800">{item.quantity}× {item.dishName}</span>
                              <span className="text-gray-500">₹{Number(item.price).toFixed(2)} each</span>
                              {item.specialNotes && (
                                <span className="text-amber-700 italic text-xs">📝 {item.specialNotes}</span>
                              )}
                              <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-semibold
                                ${item.itemStatus === 'QUEUED' ? 'bg-gray-100 text-gray-700' :
                                  item.itemStatus === 'COOKING' ? 'bg-orange-100 text-orange-800' :
                                  item.itemStatus === 'READY' ? 'bg-green-100 text-green-800' :
                                  'bg-blue-100 text-blue-800'}`}>
                                {item.itemStatus}
                              </span>
                            </div>
                          ))}
                        </div>
                        {order.specialInstructions && (
                          <div className="mt-2 text-xs text-amber-800 bg-amber-100 rounded px-2 py-1">
                            📋 {order.specialInstructions}
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function QuickBtn({ label, color, busy, onClick }) {
  const c = {
    blue:   'bg-blue-100   text-blue-700   hover:bg-blue-200',
    orange: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
    green:  'bg-green-100  text-green-700  hover:bg-green-200',
    purple: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
    gray:   'bg-gray-100   text-gray-700   hover:bg-gray-200',
  }
  return (
    <button
      onClick={onClick}
      disabled={busy}
      className={`text-xs px-2 py-1 rounded font-medium transition-colors ${c[color]} ${busy ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {busy ? '…' : label}
    </button>
  )
}

