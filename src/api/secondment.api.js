import api from './axios.service';

export const getSecondmentApi = async (employeeId, type) => {
  try {
    const response = await api.get(`/sec-exp/${employeeId}/${type}`);
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Get Seconment failed');
  }
};

export const getEmployeePageApi = async (page, limit) => {
  try {
    const response = await api.get(`/sec-exp/page?page=${page}&limit=${limit}`);
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Get Seconment failed');
  }
};

export const createSecondmentApi = async (data) => {
  try {
    const response = await api.post('/sec-exp', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Create Seconment failed');
  }
};

export const updateSecondmentApi = async (data, id) => {
  try {
    const response = await api.put(`/sec-exp/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Update Seconment failed');
  }
};

export const deleteSecondmentApi = async (pkey) => {
  try {
    const response = await api.delete(`/sec-exp/${pkey}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Delete Seconment failed');
  }
};
