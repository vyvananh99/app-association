import api from './axios.service';

export const getCompanyApi = async () => {
  try {
    const response = await api.get('/company');
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'company failed');
  }
};

export const createCompanyApi = async (data) => {
  try {
    const response = await api.post('/company', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'company failed');
  }
};

export const updateCompanyApi = async (data, id) => {
  try {
    const response = await api.put(`/company/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'company failed');
  }
};

export const deleteCompanyApi = async (id) => {
  try {
    const response = await api.delete(`/company/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'company failed');
  }
};
