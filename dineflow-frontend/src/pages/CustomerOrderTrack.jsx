import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { trackOrder, getActiveTableOrders } from '../api/orders';
import { 
  HiOutlineCheckCircle, 
  HiOutlineClock, 
  HiOutlineRefresh, 
  HiOutlinePlus,
  HiOutlineUserGroup,
  HiOutlineArrowLeft,
  HiOutlineSparkles
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const STATUS_STEPS = [
  { key: 'PENDING', label: 'Order Sent', icon: '📝', desc: 'Sent to restaurant kitchen' },
  { key: 'CONFIRMED', label: 'Confirmed', icon: '👨‍🍳', desc: 'Kitchen acknowledged order' },
  { key: 'PREPARING', label: 'Cooking', icon: '🍳', desc: 'Chef preparing your dishes' },
  { key: 'READY', label: 'Ready to Serve', icon: '🛎️', desc: 'Plated and ready for pickup' },
  { key: 'SERVED', label: 'Served', icon: '🎉', desc: 'Delivered to your table' },
];

export default function CustomerOrderTrack() {
  const { orderNumber } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [tableOrders, setTableOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('MY_ORDER'); // 'MY_ORDER' or 'TABLE_ORDERS'
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrderData = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);

      if (orderNumber.startsWith('table-')) {
        // Table view directly
        const tableNum = orderNumber.replace('table-', '');
        const orders = await getActiveTableOrders(tableNum);
        setTableOrders(orders);
        if (orders.length > 0) setOrder(orders[0]);
        setActiveTab('TABLE_ORDERS');
      } else {
        const orderData = await trackOrder(orderNumber);
        setOrder(orderData);

        // Also fetch other orders for the same table
        if (orderData?.tableNumber) {
          const tOrders = await getActiveTableOrders(orderData.tableNumber);
          setTableOrders(tOrders);
        }
      }

      if (isManual) toast.success('Status updated');
    } catch (err) {
      console.error('Track order error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrderData();

    // Auto-poll every 10 seconds for real-time kitchen updates
    const interval = setInterval(() => {
      fetchOrderData();
    }, 10000);

    return () => clearInterval(interval);
  }, [orderNumber]);

  const getStepIndex = (status) => {
    switch (status) {
      case 'PENDING': return 0;
      case 'CONFIRMED': return 1;
      case 'PREPARING': return 2;
      case 'READY': return 3;
      case 'SERVED':
      case 'COMPLETED': return 4;
      default: return 0;
    }
  };

  const currentStep = order ? getStepIndex(order.status) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-dark-700">Connecting to Live Kitchen Tracker...</p>
        </div>
      </div>
    );
  }

  if (!order && tableOrders.length === 0) {
    return (
      <div className="min-h-screen bg-dark-50 p-4 max-w-md mx-auto text-center pt-16">
        <div className="card p-8">
          <p className="text-base font-bold text-dark-800">Order Not Found</p>
          <p className="text-xs text-dark-400 mt-1 mb-5">
            Could not find active order with reference: {orderNumber}
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary text-xs py-2 px-5"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const tableNum = order?.tableNumber || (tableOrders[0]?.tableNumber || '');

  return (
    <div className="min-h-screen bg-dark-50 pb-20 font-sans">
      {/* Top Bar */}
      <header className="bg-white border-b border-dark-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(`/table/${tableNum}`)}
            className="flex items-center gap-1.5 text-xs font-bold text-dark-700 hover:text-dark-900"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            <span>Table {tableNum} Menu</span>
          </button>

          <span className="text-xs font-bold text-dark-900">
            Live Kitchen Tracking
          </span>

          <button
            onClick={() => fetchOrderData(true)}
            disabled={refreshing}
            className="p-1.5 rounded-lg text-dark-500 hover:text-primary-600 hover:bg-dark-100 transition-colors"
            title="Refresh Status"
          >
            <HiOutlineRefresh className={`w-4 h-4 ${refreshing ? 'animate-spin text-primary-500' : ''}`} />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* Navigation Tabs (My Order vs All Table Orders) */}
        <div className="flex bg-dark-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('MY_ORDER')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'MY_ORDER'
                ? 'bg-white text-dark-900 shadow-sm'
                : 'text-dark-500 hover:text-dark-800'
            }`}
          >
            My Order ({order?.orderNumber})
          </button>
          <button
            onClick={() => setActiveTab('TABLE_ORDERS')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'TABLE_ORDERS'
                ? 'bg-white text-dark-900 shadow-sm'
                : 'text-dark-500 hover:text-dark-800'
            }`}
          >
            <HiOutlineUserGroup className="w-3.5 h-3.5" />
            <span>All Orders at Table {tableNum} ({tableOrders.length})</span>
          </button>
        </div>

        {activeTab === 'MY_ORDER' && order && (
          <>
            {/* Status Hero Card */}
            <div className="bg-gradient-to-br from-dark-900 to-dark-800 text-white p-5 rounded-2xl shadow-xl space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-primary-400 tracking-wider">
                    Table {order.tableNumber} &bull; {order.customerName}
                  </span>
                  <h2 className="text-xl font-extrabold mt-0.5">{order.orderNumber}</h2>
                  <p className="text-xs text-dark-300 mt-0.5">
                    Total: ₹{order.totalAmount?.toFixed(2)} &bull; {order.items?.length} items
                  </p>
                </div>

                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-primary-500 text-white shadow">
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="pt-2">
                <div className="grid grid-cols-5 gap-1 relative">
                  {STATUS_STEPS.map((step, idx) => {
                    const isCompleted = idx <= currentStep;
                    const isCurrent = idx === currentStep;

                    return (
                      <div key={step.key} className="text-center relative">
                        <div
                          className={`w-9 h-9 mx-auto rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                            isCurrent
                              ? 'bg-primary-500 text-white ring-4 ring-primary-500/30 scale-110 shadow-lg'
                              : isCompleted
                              ? 'bg-emerald-600 text-white shadow'
                              : 'bg-dark-700 text-dark-400'
                          }`}
                        >
                          {step.icon}
                        </div>
                        <p className={`text-[10px] font-bold mt-2 leading-tight ${
                          isCurrent ? 'text-primary-400 font-extrabold' : isCompleted ? 'text-emerald-400' : 'text-dark-400'
                        }`}>
                          {step.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Individual Dishes & Cooking Statuses */}
            <div className="card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-dark-700">
                  Dish Preparation Status
                </h3>
                <span className="text-[11px] text-dark-400">Live kitchen sync</span>
              </div>

              <div className="divide-y divide-dark-100">
                {order.items?.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-dark-900 leading-tight">
                        {item.quantity}x {item.dishName}
                      </p>
                      {item.specialNotes && (
                        <p className="text-[11px] text-primary-600 italic mt-0.5">
                          Note: "{item.specialNotes}"
                        </p>
                      )}
                      <p className="text-xs text-dark-400 mt-0.5">₹{item.price?.toFixed(2)} each</p>
                    </div>

                    <div className="text-right">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                        item.itemStatus === 'SERVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.itemStatus === 'READY'
                          ? 'bg-blue-100 text-blue-800'
                          : item.itemStatus === 'COOKING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-dark-100 text-dark-600'
                      }`}>
                        {item.itemStatus}
                      </span>
                      <p className="text-xs font-bold text-dark-800 mt-1">₹{item.subtotal?.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {order.specialInstructions && (
                <div className="p-3 bg-dark-50 rounded-xl border border-dark-100 text-xs text-dark-600">
                  <span className="font-semibold text-dark-800">Special Instructions: </span>
                  {order.specialInstructions}
                </div>
              )}
            </div>

            {/* Order More Action */}
            <div className="pt-2">
              <button
                onClick={() => navigate(`/table/${tableNum}`)}
                className="w-full btn-secondary text-xs py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <HiOutlinePlus className="w-4 h-4 text-primary-400" />
                <span>Order More Food or Drinks for Table {tableNum}</span>
              </button>
            </div>
          </>
        )}

        {/* All Table Orders View (Multi-Customer Ordering from Same Table) */}
        {activeTab === 'TABLE_ORDERS' && (
          <div className="space-y-4">
            <div className="p-3.5 bg-primary-50 rounded-xl border border-primary-100 text-xs text-primary-900 flex items-center gap-2">
              <HiOutlineSparkles className="w-5 h-5 text-primary-600 flex-shrink-0" />
              <span>
                All orders placed by everyone seated at <strong>Table {tableNum}</strong>. Items will be served to your table as they are cooked.
              </span>
            </div>

            {tableOrders.length === 0 ? (
              <div className="card p-8 text-center text-dark-400">
                <p className="text-sm font-semibold">No active orders for this table yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tableOrders.map((tOrder) => (
                  <div key={tOrder.id} className="card p-4 space-y-3 border-l-4 border-l-primary-500">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-dark-900">
                            {tOrder.customerName}
                          </span>
                          <span className="text-[11px] font-mono text-dark-400">
                            ({tOrder.orderNumber})
                          </span>
                        </div>
                        <p className="text-xs text-dark-500 mt-0.5">
                          {tOrder.items?.length} items &bull; Total: ₹{tOrder.totalAmount?.toFixed(2)}
                        </p>
                      </div>

                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary-100 text-primary-800">
                        {tOrder.status}
                      </span>
                    </div>

                    <div className="divide-y divide-dark-50 text-xs">
                      {tOrder.items?.map((item) => (
                        <div key={item.id} className="py-1.5 flex items-center justify-between text-dark-700">
                          <span>
                            {item.quantity}x {item.dishName}
                          </span>
                          <span className="font-semibold">{item.itemStatus}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => navigate(`/table/${tableNum}`)}
              className="w-full btn-primary text-xs py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <HiOutlinePlus className="w-4 h-4" />
              <span>Add Your Own Items to Table {tableNum}</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

