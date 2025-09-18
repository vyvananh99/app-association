import api from './axios.service';

export const getProvisionApi = async (employeeId) => {
  try {
    const response = await api.get(`/provision/${employeeId}`);
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Get Provision failed');
  }
};

export const getEmployeePageApi = async (page, limit) => {
  try {
    const response = await api.get(`/provision/page?page=${page}&limit=${limit}`);
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Get Provision failed');
  }
};

export const createProvisionApi = async (data) => {
  try {
    const response = await api.post('/provision', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Create Provision failed');
  }
};

export const updateProvisionApi = async (data, id) => {
  try {
    const response = await api.put(`/provision/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Update Provision failed');
  }
};

export const deleteProvisionApi = async (pkey) => {
  try {
    const response = await api.delete(`/provision/${pkey}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Delete Provision failed');
  }
};
