import api from './axios.service';

export const getLeaveTypeApi = async () => {
  try {
    const response = await api.get('/leave-type');
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Leave Type failed');
  }
};

export const createLeaveTypeApi = async (data) => {
  try {
    const response = await api.post('/leave-type', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Leave Type failed');
  }
};

export const updateLeaveTypeApi = async (data, id) => {
  try {
    const response = await api.put(`/leave-type/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Leave Type failed');
  }
};

export const deleteLeaveTypeApi = async (id) => {
  try {
    const response = await api.delete(`/leave-type/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'LeaveType failed');
  }
};
