import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  getAllTables, 
  createTable, 
  updateTable, 
  deleteTable, 
  regenerateQrToken 
} from '../api/tables';
import { 
  HiOutlinePlus, 
  HiOutlineQrcode, 
  HiOutlinePencilAlt, 
  HiOutlineTrash, 
  HiOutlineExternalLink,
  HiOutlinePrinter,
  HiOutlineUserGroup,
  HiOutlineX,
  HiOutlineRefresh
} from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function AdminTables() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [qrModalTable, setQrModalTable] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);

  // Add/Edit Form
  const [formData, setFormData] = useState({
    tableNumber: '',
    capacity: 4,
    status: 'AVAILABLE',
  });

  const fetchTables = async () => {
    try {
      setLoading(true);
      const data = await getAllTables();
      setTables(data);
    } catch (err) {
      console.error('Failed to load tables:', err);
      toast.error('Failed to load dining tables');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleOpenAdd = () => {
    setEditingTable(null);
    setFormData({ tableNumber: `T-0${tables.length + 1}`, capacity: 4, status: 'AVAILABLE' });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (table) => {
    setEditingTable(table);
    setFormData({
      tableNumber: table.tableNumber,
      capacity: table.capacity,
      status: table.status,
    });
    setIsAddModalOpen(true);
  };

  const handleSaveTable = async (e) => {
    e.preventDefault();
    if (!formData.tableNumber.trim()) {
      toast.error('Table number is required');
      return;
    }

    try {
      if (editingTable) {
        await updateTable(editingTable.id, formData);
        toast.success(`Table ${formData.tableNumber} updated`);
      } else {
        await createTable(formData);
        toast.success(`Table ${formData.tableNumber} created with QR Code`);
      }
      setIsAddModalOpen(false);
      fetchTables();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save table');
    }
  };

  const handleDeleteTable = async (table) => {
    if (!window.confirm(`Delete Table ${table.tableNumber}?`)) return;
    try {
      await deleteTable(table.id);
      toast.success(`Table ${table.tableNumber} deleted`);
      fetchTables();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete table');
    }
  };

  const handleRegenerateQr = async (tableId) => {
    try {
      await regenerateQrToken(tableId);
      toast.success('QR Code regenerated with a new security token!');
      fetchTables();
      if (qrModalTable && qrModalTable.id === tableId) {
        setQrModalTable((prev) => ({ ...prev, qrCodeToken: 'updated' }));
      }
    } catch (err) {
      toast.error('Failed to regenerate QR code');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-dark-900 tracking-tight">
            Tables & QR Code Management
          </h1>
          <p className="text-xs text-dark-400 mt-1">
            Configure dining tables, generate customer QR codes, and monitor occupancy status
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn-primary flex items-center gap-2 text-xs py-2.5 px-4"
        >
          <HiOutlinePlus className="w-4 h-4" />
          <span>Add Dining Table</span>
        </button>
      </div>

      {/* Tables Grid */}
      {loading ? (
        <div className="p-12 text-center">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-dark-400">Loading dining tables...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tables.map((table) => {
            const customerUrl = `${window.location.origin}/table/${table.tableNumber}`;

            return (
              <div
                key={table.id}
                className="card p-5 space-y-4 hover:border-primary-300 transition-all border border-dark-100 flex flex-col justify-between"
              >
                <div>
                  {/* Table Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-dark-900">
                          Table {table.tableNumber}
                        </span>
                        <span className="text-[11px] text-dark-400 font-medium">
                          ({table.capacity} seats)
                        </span>
                      </div>
                      <p className="text-xs text-dark-400 mt-0.5">
                        {table.activeOrderCount > 0
                          ? `${table.activeOrderCount} Active Orders`
                          : 'No active orders'}
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        table.status === 'AVAILABLE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : table.status === 'OCCUPIED'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {table.status}
                    </span>
                  </div>

                  {/* QR Code Preview Box */}
                  <div
                    onClick={() => setQrModalTable(table)}
                    className="mt-4 p-4 bg-dark-50 rounded-xl border border-dark-200/60 flex flex-col items-center justify-center cursor-pointer hover:bg-dark-100 transition-colors group"
                    title="Click to view full printable QR card"
                  >
                    <div className="bg-white p-2.5 rounded-lg shadow-sm border border-dark-100 group-hover:scale-105 transition-transform">
                      <QRCodeSVG
                        value={customerUrl}
                        size={110}
                        level="M"
                        includeMargin={false}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-primary-600 mt-2 flex items-center gap-1">
                      <HiOutlineQrcode className="w-3.5 h-3.5" />
                      <span>View & Print QR</span>
                    </span>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="pt-3 border-t border-dark-100 flex items-center justify-between gap-1">
                  <a
                    href={`/table/${table.tableNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-dark-600 hover:text-primary-600 flex items-center gap-1 p-1.5 rounded hover:bg-dark-50"
                    title="Open Customer Order Menu"
                  >
                    <HiOutlineExternalLink className="w-4 h-4" />
                    <span>Open Menu</span>
                  </a>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(table)}
                      className="p-1.5 text-dark-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Edit Table"
                    >
                      <HiOutlinePencilAlt className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTable(table)}
                      className="p-1.5 text-dark-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Table"
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Printable QR Card Modal */}
      {qrModalTable && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center animate-fadeIn border border-dark-100 relative">
            <button
              onClick={() => setQrModalTable(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-dark-400 hover:text-dark-700 hover:bg-dark-100 transition-colors"
            >
              <HiOutlineX className="w-5 h-5" />
            </button>

            {/* Printable Area */}
            <div id="printable-qr-card" className="p-4 bg-white rounded-2xl border-2 border-dashed border-dark-200">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-primary-600 to-primary-400 text-white font-extrabold text-xl shadow mb-2">
                DF
              </div>
              <h2 className="text-xl font-extrabold text-dark-900 tracking-tight">DineFlow</h2>
              <p className="text-xs text-dark-500 font-medium">Scan to View Menu & Order</p>

              <div className="my-5 p-4 bg-white inline-block rounded-2xl border-2 border-dark-900 shadow-md">
                <QRCodeSVG
                  value={`${window.location.origin}/table/${qrModalTable.tableNumber}`}
                  size={180}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <div className="bg-dark-900 text-white py-2 px-4 rounded-xl">
                <span className="text-xs uppercase tracking-widest font-semibold opacity-80 block">Table</span>
                <span className="text-2xl font-black tracking-wider">{qrModalTable.tableNumber}</span>
              </div>

              <p className="text-[11px] text-dark-400 mt-3">
                No app or login required. Multiple people can order together.
              </p>
            </div>

            {/* Actions */}
            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                onClick={() => handleRegenerateQr(qrModalTable.id)}
                className="flex items-center gap-1 text-xs font-semibold text-dark-500 hover:text-dark-800 p-2"
                title="Generate fresh QR code token"
              >
                <HiOutlineRefresh className="w-4 h-4" />
                <span>Reset Token</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 shadow"
                >
                  <HiOutlinePrinter className="w-4 h-4" />
                  <span>Print Stand Card</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Table Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fadeIn border border-dark-100">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-dark-100">
              <h3 className="text-base font-bold text-dark-900">
                {editingTable ? `Edit Table ${editingTable.tableNumber}` : 'Add New Dining Table'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-dark-400 hover:text-dark-700"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTable} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-dark-600 mb-1">
                  Table Number / Label *
                </label>
                <input
                  type="text"
                  required
                  value={formData.tableNumber}
                  onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                  placeholder="e.g. T-09, VIP-1, Outdoor-2"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-dark-600 mb-1">
                  Seating Capacity (Guests)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value, 10) || 4 })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-dark-600 mb-1">
                  Initial Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="input-field"
                >
                  <option value="AVAILABLE">AVAILABLE (Vacant)</option>
                  <option value="OCCUPIED">OCCUPIED (Dining)</option>
                  <option value="RESERVED">RESERVED</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-dark-600 hover:bg-dark-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-5"
                >
                  {editingTable ? 'Save Changes' : 'Create Table'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

