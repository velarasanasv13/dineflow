import api from './axios';

export const getCategories = async (activeOnly = false) => {
  const res = await api.get(`/categories?activeOnly=${activeOnly}`);
  return res.data.data;
};

export const createCategory = async (categoryData) => {
  const res = await api.post('/admin/categories', categoryData);
  return res.data.data;
};

export const updateCategory = async (id, categoryData) => {
  const res = await api.put(`/admin/categories/${id}`, categoryData);
  return res.data.data;
};

export const deleteCategory = async (id) => {
  const res = await api.delete(`/admin/categories/${id}`);
  return res.data.data;
};

export const getDishes = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.categoryId) query.append('categoryId', params.categoryId);
  if (params.dietaryType) query.append('dietaryType', params.dietaryType);
  if (params.available !== undefined && params.available !== null && params.available !== '') {
    query.append('available', params.available);
  }
  if (params.search) query.append('search', params.search);

  const res = await api.get(`/dishes?${query.toString()}`);
  return res.data.data;
};

export const getMenuStats = async () => {
  const res = await api.get('/admin/menu/stats');
  return res.data.data;
};

export const createDish = async (dishData) => {
  const res = await api.post('/admin/dishes', dishData);
  return res.data.data;
};

export const updateDish = async (id, dishData) => {
  const res = await api.put(`/admin/dishes/${id}`, dishData);
  return res.data.data;
};

export const toggleDishAvailability = async (id, available) => {
  const query = available !== undefined ? `?available=${available}` : '';
  const res = await api.patch(`/admin/dishes/${id}/availability${query}`);
  return res.data.data;
};

export const deleteDish = async (id) => {
  const res = await api.delete(`/admin/dishes/${id}`);
  return res.data.data;
};

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await api.post('/admin/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data.url;
};

