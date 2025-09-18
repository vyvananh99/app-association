import api from './axios.service';

export const getAllowTypeApi = async () => {
  try {
    const response = await api.get('/allow-type');
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Allow Type failed');
  }
};

export const createAllowTypeApi = async (data) => {
  try {
    const response = await api.post('/allow-type', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Allow Type failed');
  }
};

export const updateAllowTypeApi = async (data, id) => {
  try {
    const response = await api.put(`/allow-type/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Allow Type failed');
  }
};

export const deleteAllowTypeApi = async (id) => {
  try {
    const response = await api.delete(`/allow-type/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'AllowType failed');
  }
};
