import api from './axios.service';

export const getWorklevelApi = async () => {
  try {
    const response = await api.get('/worklevel');
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Worklevelfailed');
  }
};

export const createWorklevelApi = async (data) => {
  try {
    const response = await api.post('/worklevel', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Worklevelfailed');
  }
};

export const updateWorklevelApi = async (data, id) => {
  try {
    const response = await api.put(`/worklevel/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Worklevelfailed');
  }
};

export const deleteWorklevelApi = async (id) => {
  try {
    const response = await api.delete(`/worklevel/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Worklevel failed');
  }
};
