import api from './axios';

export const resolveTable = async (tokenOrNumber) => {
  const res = await api.get(`/tables/resolve/${tokenOrNumber}`);
  return res.data.data;
};

export const getTableQrBase64 = async (tableId) => {
  const res = await api.get(`/tables/${tableId}/qrcode/base64`);
  return res.data.data;
};

export const getAllTables = async (activeOnly = false) => {
  const res = await api.get(`/admin/tables?activeOnly=${activeOnly}`);
  return res.data.data;
};

export const createTable = async (tableData) => {
  const res = await api.post('/admin/tables', tableData);
  return res.data.data;
};

export const updateTable = async (id, tableData) => {
  const res = await api.put(`/admin/tables/${id}`, tableData);
  return res.data.data;
};

export const deleteTable = async (id) => {
  const res = await api.delete(`/admin/tables/${id}`);
  return res.data.data;
};

export const regenerateQrToken = async (id) => {
  const res = await api.post(`/admin/tables/${id}/regenerate-qr`);
  return res.data.data;
};

