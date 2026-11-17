import { useState, useEffect } from 'react'
import { getSummaryReport } from '../api/billing'

export default function AdminReports() {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchReport = async () => {
    try {
      setLoading(true)
      const res = await getSummaryReport()
      setReport(res.data.data)
    } catch (err) {
      console.error('Failed to load report', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReport()
  }, [])

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-400">Loading business analytics...</div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">📊 Business Reports &amp; Analytics</h1>
        <p className="text-sm text-gray-500">Live sales performance, order counts, and top-performing dishes</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Revenue</span>
          <div className="text-3xl font-extrabold text-orange-600 mt-2">
            ₹{Number(report?.totalRevenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-xs text-gray-400 mt-1 block">All active &amp; completed orders</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Orders</span>
          <div className="text-3xl font-extrabold text-gray-900 mt-2">{report?.totalOrders || 0}</div>
          <span className="text-xs text-emerald-600 mt-1 block font-medium">
            {report?.completedOrders || 0} completed
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">In-Kitchen Orders</span>
          <div className="text-3xl font-extrabold text-blue-600 mt-2">{report?.pendingOrders || 0}</div>
          <span className="text-xs text-gray-400 mt-1 block">Active across tables</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Avg Order Value</span>
          <div className="text-3xl font-extrabold text-gray-900 mt-2">
            ₹{Number(report?.avgOrderValue || 0).toFixed(2)}
          </div>
          <span className="text-xs text-gray-400 mt-1 block">Per customer order</span>
        </div>
      </div>

      {/* Top Dishes & Daily Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Dishes */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 text-base mb-4 flex items-center gap-2">
            <span>🔥</span> Top Performing Dishes
          </h2>
          <div className="divide-y divide-gray-100">
            {report?.topDishes?.length === 0 ? (
              <div className="text-gray-400 text-sm py-4">No dish sales recorded yet.</div>
            ) : (
              report?.topDishes?.map((dish, i) => (
                <div key={i} className="py-3 flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="font-medium text-gray-800">{dish.dishName}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{dish.totalQuantity} orders</div>
                    <div className="text-xs text-gray-400">₹{Number(dish.totalRevenue).toFixed(2)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Daily Revenue Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 text-base mb-4 flex items-center gap-2">
            <span>📈</span> Recent Daily Revenue
          </h2>
          <div className="divide-y divide-gray-100">
            {report?.dailyRevenue?.length === 0 ? (
              <div className="text-gray-400 text-sm py-4">No daily revenue records found.</div>
            ) : (
              report?.dailyRevenue?.map((d, i) => (
                <div key={i} className="py-3 flex justify-between items-center text-sm">
                  <div>
                    <span className="font-semibold text-gray-800">{d.date}</span>
                    <span className="text-xs text-gray-400 ml-2">({d.orders} orders)</span>
                  </div>
                  <span className="font-extrabold text-emerald-600">
                    ₹{Number(d.revenue).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

