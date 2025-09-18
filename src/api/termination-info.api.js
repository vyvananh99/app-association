import api from './axios.service';

export const getTerminationInfoApi = async (employeeId, data) => {
  try {
    const response = await api.get(`/ter-info/${employeeId}`, {
      params: data
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'TerminationInfo failed');
  }
};
