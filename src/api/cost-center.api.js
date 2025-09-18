import api from './axios.service';

export const getCostCenterApi = async () => {
  try {
    const response = await api.get('/cost-center');
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Cost Center failed');
  }
};

export const createCostCenterApi = async (data) => {
  try {
    const response = await api.post('/cost-center', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Cost Center failed');
  }
};

export const updateCostCenterApi = async (data, id) => {
  try {
    const response = await api.put(`/cost-center/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Cost Center failed');
  }
};

export const deleteCostCenterApi = async (id) => {
  try {
    const response = await api.delete(`/cost-center/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'CostCenter failed');
  }
};
