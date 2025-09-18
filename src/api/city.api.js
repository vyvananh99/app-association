import api from './axios.service';

export const getCityApi = async () => {
  try {
    const response = await api.get('/city');
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'City failed');
  }
};

export const createCityApi = async (data) => {
  try {
    const response = await api.post('/city', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'City failed');
  }
};

export const updateCityApi = async (data, id) => {
  try {
    const response = await api.put(`/city/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'City failed');
  }
};

export const deleteCityApi = async (id) => {
  try {
    const response = await api.delete(`/city/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'City failed');
  }
};
