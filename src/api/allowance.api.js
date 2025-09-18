import api from './axios.service';

export const getAllowanceApi = async () => {
  try {
    const response = await api.get(`/allowance`);
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Get Allowance failed');
  }
};

export const getAllowanceByEmployeeApi = async (employeeId) => {
  try {
    const response = await api.get(`/allowance/${employeeId}`);
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Get Allowance failed');
  }
};

export const getAllowanceInfoApi = async () => {
  try {
    const response = await api.get(`/allowance/info`);
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Get Allowance failed');
  }
};

export const checkAllowanceApi = async (data) => {
  try {
    const response = await api.post(`/allowance/check-allowance`, data);
    if (response.data.token) {
      return response.data;
    }
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Get Allowance failed');
  }
};

export const getEmployeePageApi = async (page, limit) => {
  try {
    const response = await api.get(`/allowance/page?page=${page}&limit=${limit}`);
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Get Allowance failed');
  }
};

export const createAllowanceApi = async (data) => {
  try {
    const response = await api.post('/allowance', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Create Allowance failed');
  }
};

export const uploadAllowanceApi = async (data) => {
  try {
    const response = await api.post('/allowance/upload', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Create Allowance failed');
  }
};

export const updateAllowanceApi = async (data, id) => {
  try {
    const response = await api.put(`/allowance/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Update Allowance failed');
  }
};

export const deleteAllowanceApi = async (pkey) => {
  try {
    const response = await api.delete(`/allowance/${pkey}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Delete Allowance failed');
  }
};
