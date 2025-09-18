import api from './axios.service';

export const loginApi = async (email, password, comId) => {
  try {
    // Make the POST request to the login endpoint
    const response = await api.post('/auth/login-ass', { email, password, comId });
    // Assuming the response contains a token or some user data on successful login
    if (response.data.token) {
      // You can store the token in localStorage or cookies for session persistence
      return response.data; // You can return the data to further use in the app
    }

    return response.data; // In case you return some data (without token)
  } catch (error) {
    // Optionally, you can return a custom error message or re-throw the error
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const logoutApi = async () => {
  try {
    // Make the POST request to the logout endpoint
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};
