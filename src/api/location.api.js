import api from './axios.service';

export const getLocationApi = async () => {
  try {
    const response = await api.get('/location');
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Location failed');
  }
};

export const createLocationApi = async (data) => {
  try {
    const response = await api.post('/location', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Location failed');
  }
};

export const updateLocationApi = async (data, id) => {
  try {
    const response = await api.put(`/location/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Location failed');
  }
};

export const deleteLocationApi = async (id) => {
  try {
    const response = await api.delete(`/location/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Location failed');
  }
};
