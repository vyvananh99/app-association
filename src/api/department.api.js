import api from './axios.service';

export const getDepartmentApi = async () => {
  try {
    const response = await api.get('/department');
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Department failed');
  }
};

export const createDepartmentApi = async (data) => {
  try {
    const response = await api.post('/department', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Department failed');
  }
};

export const updateDepartmentApi = async (data, id) => {
  try {
    const response = await api.put(`/department/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Department failed');
  }
};

export const deleteDepartmentApi = async (id, comId) => {
  try {
    const response = await api.delete(`/department/${id}/${comId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Department failed');
  }
};
