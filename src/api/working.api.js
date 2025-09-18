import api from './axios.service';

export const getWorkingApi = async () => {
  try {
    const response = await api.get('/working');
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Get Working failed');
  }
};

export const getWorkingInfoApi = async () => {
  try {
    const response = await api.get('/working/info');
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Get Working failed');
  }
};

export const getWorkingInfoByEmployeeApi = async (employeeId, comId) => {
  try {
    const response = await api.get(`/working/info/${employeeId}`);
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Get Working failed');
  }
};

export const getWorkingPageApi = async (page, limit) => {
  try {
    const response = await api.get(`/working/page?page=${page}&limit=${limit}`);
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Working failed');
  }
};

export const createWorkingApi = async (data) => {
  try {
    const response = await api.post('/working', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Create Working failed');
  }
};

export const updateWorkingApi = async (data, id) => {
  try {
    const response = await api.put(`/working/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Update Working failed');
  }
};

export const deleteWorkingApi = async (WorkingId, comId) => {
  try {
    const response = await api.delete(`/working/${WorkingId}/${comId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Delete Working failed');
  }
};
