import api from './axios.service';

export const getEmployeeCvApi = async (employeeId, comId) => {
  try {
    const response = await api.get(`/employee-cv/${employeeId}/${comId}`);
    if (response.data.token) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'EmployeeCv failed');
  }
};

export const createEmployeeCvApi = async (data) => {
  data.maritalStatus = data.maritalStatus.toString();
  data.religion = data.religion.toString();
  data.nationality = data.nationality.toString();
  data.cTactRelation = data.cTactRelation.toString();
  data.education = data.education.toString();
  try {
    const response = await api.post('/employee-cv', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'EmployeeCv failed');
  }
};

export const updateEmployeeCvApi = async (employeeId, comId, data) => {
  try {
    const response = await api.put(`/employee-cv/${employeeId}/${comId}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'EmployeeCv failed');
  }
};

export const deleteEmployeeCvApi = async (employeeId, comId) => {
  try {
    const response = await api.delete(`/employee-cv/${employeeId}/${comId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'EmployeeCv failed');
  }
};
