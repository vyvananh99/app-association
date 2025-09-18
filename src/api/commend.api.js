import api from './axios.service';

export const getCommendApi = async (employeeId, comId) => {
  try {
    const response = await api.get(`/commend/${employeeId}/${comId}`);
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Get Commend failed');
  }
};

export const getEmployeePageApi = async (page, limit) => {
  try {
    const response = await api.get(`/commend/page?page=${page}&limit=${limit}`);
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Get Commend failed');
  }
};

export const createCommendApi = async (data) => {
  try {
    const response = await api.post('/commend', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Create Commend failed');
  }
};

export const updateCommendApi = async (data, id) => {
  try {
    const response = await api.put(`/commend/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Update Commend failed');
  }
};

export const deleteCommendApi = async (pkey) => {
  try {
    const response = await api.delete(`/commend/${pkey}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Delete Commend failed');
  }
};
