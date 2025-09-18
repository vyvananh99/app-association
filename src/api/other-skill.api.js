import api from './axios.service';

export const getOtherSkillApi = async (employeeId) => {
  try {
    const response = await api.get(`/other-skill/${employeeId}`);
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Get other skill failed');
  }
};

export const createOtherSkillApi = async (data) => {
  try {
    const response = await api.post('/other-skill', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Create other skill failed');
  }
};

export const updateOtherSkillApi = async (data, id) => {
  try {
    const response = await api.put(`/other-skill/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Update other skill failed');
  }
};

export const deleteOtherSkillApi = async (pkey) => {
  try {
    const response = await api.delete(`/other-skill/${pkey}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Delete other skill failed');
  }
};
