import api from './axios.service';

export const getCasualApi = async () => {
  try {
    const response = await api.get('/casual');
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Casual failed');
  }
};

export const createCasualApi = async (data) => {
  try {
    const response = await api.post('/casual', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Casual failed');
  }
};

export const updateCasualApi = async (data, id) => {
  try {
    const response = await api.put(`/casual/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Casual failed');
  }
};

export const deleteCasualApi = async (id) => {
  try {
    const response = await api.delete(`/casual/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Casual failed');
  }
};
