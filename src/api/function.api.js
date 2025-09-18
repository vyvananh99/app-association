import api from './axios.service';

export const getFunctionApi = async () => {
  try {
    const response = await api.get('/function');
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Function failed');
  }
};

export const createFunctionApi = async (data) => {
  try {
    const response = await api.post('/function', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Function failed');
  }
};

export const updateFunctionApi = async (data, id) => {
  try {
    const response = await api.put(`/function/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Function failed');
  }
};

export const deleteFunctionApi = async (id) => {
  try {
    const response = await api.delete(`/function/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Function failed');
  }
};
