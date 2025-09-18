import api from './axios.service';

export const getFamilyApi = async (employeeId) => {
  try {
    const response = await api.get(`/family/${employeeId}`);
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Get Family failed');
  }
};

export const getEmployeePageApi = async (page, limit) => {
  try {
    const response = await api.get(`/family/page?page=${page}&limit=${limit}`);
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Get Family failed');
  }
};

export const createFamilyApi = async (data) => {
  try {
    const response = await api.post('/family', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Create Family failed');
  }
};

export const updateFamilyApi = async (data, id) => {
  try {
    const response = await api.put(`/family/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Update Family failed');
  }
};

export const deleteFamilyApi = async (pkey) => {
  try {
    const response = await api.delete(`/family/${pkey}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Delete Family failed');
  }
};
