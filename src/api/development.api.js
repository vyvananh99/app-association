import api from './axios.service';

export const getDevelopmentApi = async (employeeId) => {
  try {
    const response = await api.get(`/development/${employeeId}`);
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Get DevPlan failed');
  }
};

export const getEmployeePageApi = async (page, limit) => {
  try {
    const response = await api.get(`/development/page?page=${page}&limit=${limit}`);
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Get DevPlan failed');
  }
};

export const createDevelopmentApi = async (data) => {
  try {
    const response = await api.post('/development', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Create DevPlan failed');
  }
};

export const updateDevelopmentApi = async (data, id) => {
  try {
    const response = await api.put(`/development/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Update DevPlan failed');
  }
};

export const deleteDevelopmentApi = async (pkey) => {
  try {
    const response = await api.delete(`/development/${pkey}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Delete DevPlan failed');
  }
};
