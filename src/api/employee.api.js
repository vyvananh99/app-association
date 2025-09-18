import api from './axios.service';

export const getEmployeeApi = async () => {
  try {
    const response = await api.get('/employee');
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Employee failed');
  }
};

export const getEmployeeInfoApi = async () => {
  try {
    const response = await api.get('/employee/info');
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Employee failed');
  }
};

export const getEmployeePageApi = async (page, limit) => {
  try {
    const response = await api.get(`/employee/page?page=${page}&limit=${limit}`);
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Employee failed');
  }
};

export const createEmployeeApi = async (data) => {
  try {
    const response = await api.post('/employee', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Employee failed');
  }
};

export const updateEmployeeApi = async (data, id, comId, pkey) => {
  try {
    const response = await api.put(`/employee/${id}/${comId}/${pkey}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Employee failed');
  }
};

export const deleteEmployeeApi = async (employeeId, comId) => {
  try {
    const response = await api.delete(`/employee/${employeeId}/${comId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Employee failed');
  }
};
