import api from './axios.service';

export const getOtherListApi = async () => {
  try {
    const response = await api.get('/other-list');
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Other List failed');
  }
};

export const createOtherListApi = async (data) => {
  try {
    const response = await api.post('/other-list', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Other List failed');
  }
};

export const updateOtherListApi = async (data, id) => {
  try {
    const response = await api.put(`/other-list/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Other List failed');
  }
};

export const deleteOtherListApi = async (id) => {
  try {
    const response = await api.delete(`/other-list/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'OtherList failed');
  }
};
