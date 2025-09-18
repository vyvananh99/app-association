import api from './axios.service';

export const getAcademyApi = async (employeeId) => {
  try {
    const response = await api.get(`/academy/${employeeId}`);
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Get academy failed');
  }
};

export const createAcademyApi = async (data) => {
  try {
    const response = await api.post('/academy', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Create academy failed');
  }
};

export const updateAcademyApi = async (data, id) => {
  try {
    const response = await api.put(`/academy/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Update academy failed');
  }
};

export const deleteAcademyApi = async (pkey) => {
  try {
    const response = await api.delete(`/academy/${pkey}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Delete academy failed');
  }
};
