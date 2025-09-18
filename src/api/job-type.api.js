import api from './axios.service';

export const getJobTypeApi = async () => {
  try {
    const response = await api.get('/job-type');
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Job Type failed');
  }
};

export const createJobTypeApi = async (data) => {
  try {
    const response = await api.post('/job-type', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Job Type failed');
  }
};

export const updateJobTypeApi = async (data, id) => {
  try {
    const response = await api.put(`/job-type/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Job Type failed');
  }
};

export const deleteJobTypeApi = async (id) => {
  try {
    const response = await api.delete(`/job-type/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'JobType failed');
  }
};
