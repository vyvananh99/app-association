import api from './axios.service';

export const getComLoanApi = async (employeeId) => {
  try {
    const response = await api.get(`/com-loan/${employeeId}`);
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Get ComLoan failed');
  }
};

export const getEmployeePageApi = async (page, limit) => {
  try {
    const response = await api.get(`/com-loan/page?page=${page}&limit=${limit}`);
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Get ComLoan failed');
  }
};

export const createComLoanApi = async (data) => {
  try {
    const response = await api.post('/com-loan', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Create ComLoan failed');
  }
};

export const updateComLoanApi = async (data, id) => {
  try {
    const response = await api.put(`/com-loan/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Update ComLoan failed');
  }
};

export const deleteComLoanApi = async (pkey) => {
  try {
    const response = await api.delete(`/com-loan/${pkey}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Delete ComLoan failed');
  }
};
