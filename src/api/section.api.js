import api from './axios.service';

export const getSectionApi = async () => {
  try {
    const response = await api.get('/section');
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Section failed');
  }
};

export const createSectionApi = async (data) => {
  try {
    const response = await api.post('/section', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Section failed');
  }
};

export const updateSectionApi = async (data, id) => {
  try {
    const response = await api.put(`/section/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Section failed');
  }
};

export const deleteSectionApi = async (id, comId, depId) => {
  try {
    const response = await api.delete(`/section/${id}/${comId}/${depId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Section failed');
  }
};
