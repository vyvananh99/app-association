import api from './axios.service';

export const getContractTypeApi = async () => {
  try {
    const response = await api.get('/contract-type');
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Contract Type failed');
  }
};

export const createContractTypeApi = async (data) => {
  try {
    const response = await api.post('/contract-type', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Contract Type failed');
  }
};

export const updateContractTypeApi = async (data, id) => {
  try {
    const response = await api.put(`/contract-type/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Contract Type failed');
  }
};

export const deleteContractTypeApi = async (id) => {
  try {
    const response = await api.delete(`/contract-type/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Contract Type failed');
  }
};
