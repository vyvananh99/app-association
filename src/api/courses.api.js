import api from './axios.service';

export const getCoursesApi = async () => {
  try {
    const response = await api.get(`/courses`);
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Get training process failed');
  }
};

export const createCoursesApi = async (data) => {
  try {
    const response = await api.post('/courses', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Create training process failed');
  }
};

export const updateCoursesApi = async (data, id) => {
  try {
    const response = await api.put(`/courses/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Update training process failed');
  }
};

export const deleteCoursesApi = async (pkey) => {
  try {
    const response = await api.delete(`/courses/${pkey}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Delete training process failed');
  }
};
