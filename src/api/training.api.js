import api from './axios.service';

export const getTrainingApi = async (employeeId, comId) => {
  try {
    const response = await api.get(`/training/${employeeId}/${comId}`);
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Training failed');
  }
};

export const getTrainingParticipantsApi = async (courseId) => {
  try {
    const response = await api.get(`/training/course/${courseId}`);
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Training failed');
  }
};

export const getTrainingByParticipantApi = async (courseId) => {
  try {
    const response = await api.get(`/training/participant/${courseId}`);
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Training failed');
  }
};

export const createTrainingApi = async (data) => {
  try {
    const response = await api.post('/training', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Training failed');
  }
};

export const updateTrainingApi = async (data, pkey) => {
  try {
    const response = await api.put(`/training/${pkey}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Training failed');
  }
};

export const deleteTrainingApi = async (pkey) => {
  try {
    const response = await api.delete(`/training/${pkey}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Training failed');
  }
};
