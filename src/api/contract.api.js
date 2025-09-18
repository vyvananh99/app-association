import api from './axios.service';

export const getContractApi = async () => {
  try {
    const response = await api.get('/contract');
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Contract Type failed');
  }
};

export const getContractByEmployeeApi = async (employeeId) => {
  try {
    const response = await api.get(`/contract/${employeeId}`);
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Contract Type failed');
  }
};

export const createContractApi = async (data) => {
  try {
    const response = await api.post('/contract', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Contract Type failed');
  }
};

export const updateContractApi = async (data, id) => {
  try {
    const response = await api.put(`/contract/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Contract Type failed');
  }
};

export const deleteContractApi = async (id) => {
  try {
    const response = await api.delete(`/contract/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Contract Type failed');
  }
};
