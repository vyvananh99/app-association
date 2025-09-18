import api from './axios.service';

export const getDisciplineApi = async (employeeId, comId) => {
  try {
    const response = await api.get(`/discipline/${employeeId}/${comId}`);
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Get Discipline failed');
  }
};

export const getEmployeePageApi = async (page, limit) => {
  try {
    const response = await api.get(`/discipline/page?page=${page}&limit=${limit}`);
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Get Discipline failed');
  }
};

export const createDisciplineApi = async (data) => {
  try {
    const response = await api.post('/discipline', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Create Discipline failed');
  }
};

export const updateDisciplineApi = async (data, id) => {
  try {
    const response = await api.put(`/discipline/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Update Discipline failed');
  }
};

export const deleteDisciplineApi = async (pkey) => {
  try {
    const response = await api.delete(`/discipline/${pkey}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Delete Discipline failed');
  }
};
