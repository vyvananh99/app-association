import api from './axios.service';

export const getOtherListXApi = async () => {
  try {
    const response = await api.get('/other-list-x');
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Allow Type failed');
  }
};

// export const createOtherListNApi = async (data) => {
//   try {
//     const response = await api.post('/other-list-n', data);
//     return response.data;
//   } catch (error) {
//     throw new Error(error.response?.data?.message || 'Allow Type failed');
//   }
// };

// export const updateOtherListNApi = async (data, id) => {
//   try {
//     const response = await api.put(`/other-list-n/${id}`, data);
//     return response.data;
//   } catch (error) {
//     throw new Error(error.response?.data?.message || 'Allow Type failed');
//   }
// };

// export const deleteOtherListNApi = async (id) => {
//   try {
//     const response = await api.delete(`/other-list-n/${id}`);
//     return response.data;
//   } catch (error) {
//     throw new Error(error.response?.data?.message || 'OtherListN failed');
//   }
// };
