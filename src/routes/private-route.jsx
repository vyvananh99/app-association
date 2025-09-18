import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth(); // Lấy từ AuthContext
  const token = localStorage.getItem('auth-token'); // Kiểm tra localStorage

  return isAuthenticated || token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
