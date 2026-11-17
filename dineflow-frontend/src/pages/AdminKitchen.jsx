import { useState, useEffect, useCallback } from 'react'
import {
  getKitchenOrders,
  getKitchenStats,
  updateOrderStatus,
  updateItemStatus,
} from '../api/kitchen'

const STATUS_COLORS = {
  PENDING:   'bg-yellow-100 text-yellow-800 border-yellow-300',
  CONFIRMED: 'bg-blue-100   text-blue-800   border-blue-300',
  PREPARING: 'bg-orange-100 text-orange-800 border-orange-300',
  READY:     'bg-green-100  text-green-800  border-green-300',
  SERVED:    'bg-gray-100   text-gray-600   border-gray-300',
  COMPLETED: 'bg-gray-100   text-gray-600   border-gray-300',
}

const ITEM_STATUS_COLORS = {
  QUEUED:  'bg-gray-100  text-gray-700',
  COOKING: 'bg-orange-100 text-orange-800',
  READY:   'bg-green-100  text-green-800',
  SERVED:  'bg-blue-100   text-blue-800',
}

const ITEM_NEXT = {
  QUEUED:  'COOKING',
  COOKING: 'READY',
  READY:   'SERVED',
  SERVED:  null,
}

const FILTER_TABS = ['ALL', 'PENDING', 'CONFIRMED', 'PREPARING', 'READY']

function elapsed(createdAt) {
  if (!createdAt) return ''
  const diff = Math.floor((Date.now() - new Date(createdAt)) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return `${Math.floor(diff / 3600)}h ago`
}

function cardBorder(createdAt) {
  if (!createdAt) return 'border-gray-200'
  const mins = (Date.now() - new Date(createdAt)) / 60000
  if (mins > 20) return 'border-red-400'
  if (mins > 10) return 'border-amber-400'
  return 'border-green-400'
}

export default function AdminKitchen() {
  const [orders, setOrders]   = useState([])
  const [stats,  setStats]    = useState({})
  const [filter, setFilter]   = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy]       = useState({})   // itemId / orderId → true while updating

  const load = useCallback(async () => {
    try {
      const [oRes, sRes] = await Promise.all([getKitchenOrders(), getKitchenStats()])
      setOrders(oRes.data.data || [])
      setStats(sRes.data.data  || {})
    } catch (e) {
      console.error('Kitchen load error', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    const id = setInterval(load, 5000)
    return () => clearInterval(id)
  }, [load])

  const handleOrderStatus = async (orderId, status) => {
    setBusy(b => ({ ...b, [`order-${orderId}`]: true }))
    try {
      await updateOrderStatus(orderId, status)
      await load()
    } finally {
      setBusy(b => { const n = { ...b }; delete n[`order-${orderId}`]; return n })
    }
  }

  const handleItemStatus = async (itemId, nextStatus) => {
    if (!nextStatus) return
    setBusy(b => ({ ...b, [`item-${itemId}`]: true }))
    try {
      await updateItemStatus(itemId, nextStatus)
      await load()
    } finally {
      setBusy(b => { const n = { ...b }; delete n[`item-${itemId}`]; return n })
    }
  }

  const filtered = filter === 'ALL' ? orders : orders.filter(o => o.status === filter)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🍳</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Kitchen Display</h1>
            <p className="text-xs text-gray-500">Auto-refreshes every 5 s</p>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex gap-4 text-sm">
          {[
            { label: 'Active',    value: stats.totalActive, color: 'text-gray-900' },
            { label: 'Pending',   value: stats.pending,     color: 'text-yellow-600' },
            { label: 'Confirmed', value: stats.confirmed,   color: 'text-blue-600' },
            { label: 'Preparing', value: stats.preparing,   color: 'text-orange-600' },
            { label: 'Ready',     value: stats.ready,       color: 'text-green-600' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value ?? 0}</div>
              <div className="text-gray-500 text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="bg-white border-b px-6">
        <div className="flex gap-1">
          {FILTER_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                filter === tab
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
              {tab !== 'ALL' && (
                <span className="ml-1 text-xs bg-gray-100 rounded-full px-1.5 py-0.5">
                  {orders.filter(o => o.status === tab).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Orders grid */}
      <div className="p-6">
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading kitchen orders…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎉</div>
            <p className="text-gray-500 text-lg">No active orders right now</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                busy={busy}
                onOrderStatus={handleOrderStatus}
                onItemStatus={handleItemStatus}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function OrderCard({ order, busy, onOrderStatus, onItemStatus }) {
  const borderColor = cardBorder(order.createdAt)

  return (
    <div className={`bg-white rounded-xl border-2 ${borderColor} shadow-sm overflow-hidden`}>
      {/* Card header */}
      <div className="px-4 pt-4 pb-3 border-b flex justify-between items-start">
        <div>
          <div className="font-bold text-gray-900 text-sm">{order.orderNumber}</div>
          <div className="text-xs text-gray-500 mt-0.5">
            🪑 {order.tableNumber} &nbsp;·&nbsp; 👤 {order.customerName}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">🕐 {elapsed(order.createdAt)}</div>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${STATUS_COLORS[order.status] || 'bg-gray-100'}`}>
          {order.status}
        </span>
      </div>

      {/* Items */}
      <div className="px-4 py-3 space-y-2">
        {(order.items || []).map(item => {
          const next = ITEM_NEXT[item.itemStatus]
          const isBusy = busy[`item-${item.id}`]
          return (
            <div key={item.id} className="flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800 truncate">
                  {item.quantity}× {item.dishName}
                </div>
                {item.specialNotes && (
                  <div className="text-xs text-amber-700 italic">📝 {item.specialNotes}</div>
                )}
              </div>
              <button
                onClick={() => onItemStatus(item.id, next)}
                disabled={!next || isBusy}
                className={`text-xs px-2 py-1 rounded-full font-semibold whitespace-nowrap transition-all ${
                  ITEM_STATUS_COLORS[item.itemStatus]
                } ${next && !isBusy ? 'cursor-pointer hover:opacity-80 hover:scale-105' : 'cursor-default opacity-70'}`}
              >
                {isBusy ? '…' : item.itemStatus}
                {next && !isBusy && <span className="ml-1 opacity-60">→</span>}
              </button>
            </div>
          )
        })}
      </div>

      {order.specialInstructions && (
        <div className="mx-4 mb-3 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded px-2 py-1">
          📋 {order.specialInstructions}
        </div>
      )}

      {/* Action buttons */}
      <div className="px-4 pb-4 flex flex-wrap gap-2 border-t pt-3">
        {order.status === 'PENDING' && (
          <ActionBtn
            label="✅ Confirm"
            color="blue"
            busy={busy[`order-${order.id}`]}
            onClick={() => onOrderStatus(order.id, 'CONFIRMED')}
          />
        )}
        {order.status === 'CONFIRMED' && (
          <ActionBtn
            label="🍳 Start Cooking"
            color="orange"
            busy={busy[`order-${order.id}`]}
            onClick={() => onOrderStatus(order.id, 'PREPARING')}
          />
        )}
        {order.status === 'PREPARING' && (
          <ActionBtn
            label="🔔 Mark Ready"
            color="green"
            busy={busy[`order-${order.id}`]}
            onClick={() => onOrderStatus(order.id, 'READY')}
          />
        )}
        {order.status === 'READY' && (
          <ActionBtn
            label="🏁 Served"
            color="gray"
            busy={busy[`order-${order.id}`]}
            onClick={() => onOrderStatus(order.id, 'SERVED')}
          />
        )}
      </div>
    </div>
  )
}

function ActionBtn({ label, color, busy, onClick }) {
  const colorMap = {
    blue:   'bg-blue-500   hover:bg-blue-600   text-white',
    orange: 'bg-orange-500 hover:bg-orange-600 text-white',
    green:  'bg-green-500  hover:bg-green-600  text-white',
    gray:   'bg-gray-500   hover:bg-gray-600   text-white',
  }
  return (
    <button
      onClick={onClick}
      disabled={busy}
      className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${colorMap[color]} ${busy ? 'opacity-60 cursor-not-allowed' : ''}`}
    >
      {busy ? 'Updating…' : label}
    </button>
  )
}

