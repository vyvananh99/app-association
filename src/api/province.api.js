import api from './axios.service';

export const getProvinceApi = async () => {
  try {
    const response = await api.get('/province');
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Province failed');
  }
};

export const createProvinceApi = async (data) => {
  try {
    const response = await api.post('/province', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Province failed');
  }
};

export const updateProvinceApi = async (data, id) => {
  try {
    const response = await api.put(`/province/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Province failed');
  }
};

export const deleteProvinceApi = async (id) => {
  try {
    const response = await api.delete(`/province/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Province failed');
  }
};
