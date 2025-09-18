// /login/success page
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';

const GoogleLoginSuccess = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userBase64 = params.get('user'); // dữ liệu user được encode
    let user = null;
    if (userBase64) {
      try {
        user = JSON.parse(atob(userBase64)); // giải mã base64 về object
      } catch (err) {
        console.error('Failed to parse user data', err);
      }
    }
    console.log('user', user);
    if (token && user) {
      login(user.email, user, token);
      localStorage.setItem('auth-token', token);
      navigate('/'); // redirect sau khi lưu token
    } else {
      navigate('/login'); // nếu ko có token, quay lại login
    }
  }, []);

  return <div>Logging in...</div>;
};

export default GoogleLoginSuccess;
