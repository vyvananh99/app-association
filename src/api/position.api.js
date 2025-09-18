import api from './axios.service';

export const getPositionApi = async () => {
  try {
    const response = await api.get('/position');
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Position failed');
  }
};

export const createPositionApi = async (data) => {
  try {
    const response = await api.post('/position', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Position failed');
  }
};

export const updatePositionApi = async (data, id) => {
  try {
    const response = await api.put(`/position/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Position failed');
  }
};

export const deletePositionApi = async (id) => {
  try {
    const response = await api.delete(`/position/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Position failed');
  }
};
