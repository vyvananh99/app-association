import api from './axios.service';

export const getLanguageApi = async (employeeId) => {
  try {
    const response = await api.get(`/language/${employeeId}`);
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Get language failed');
  }
};

export const createLanguageApi = async (data) => {
  try {
    const response = await api.post('/language', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Create language failed');
  }
};

export const updateLanguageApi = async (data, id) => {
  try {
    const response = await api.put(`/language/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Update language failed');
  }
};

export const deleteLanguageApi = async (pkey) => {
  try {
    const response = await api.delete(`/language/${pkey}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Delete language failed');
  }
};
