import api from './axios.service';

export const calcIncomTax = async (goss) => {
  try {
    const response = await api.get(`/function-db/income-tax?goss=${goss}`);
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Get training process failed');
  }
};