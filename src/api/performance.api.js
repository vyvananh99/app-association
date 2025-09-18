import api from './axios.service';

export const getPerformanceApi = async (employeeId, comId, year) => {
  try {
    const response = await api.get(`/performance/${employeeId}/${comId}/${year}`);
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Get Performance failed');
  }
};

export const createPerformanceApi = async (data) => {
  try {
    const response = await api.post('/performance', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Create Performance failed');
  }
};

export const updatePerformanceApi = async (data, id) => {
  try {
    const response = await api.put(`/performance/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Update Performance failed');
  }
};

export const deletePerformanceApi = async (pkey) => {
  try {
    const response = await api.delete(`/performance/${pkey}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Delete Performance failed');
  }
};
