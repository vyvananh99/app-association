import React, { createContext, useState, useContext } from 'react';

// Tạo context cho đăng nhập
const AuthContext = createContext();

// Tạo provider để cung cấp dữ liệu đăng nhập
export const AuthProvider = ({ children }) => {
  const authToken = localStorage.getItem('auth-token');
  const [isAuthenticated, setIsAuthenticated] = useState(authToken ? true : false); // Trạng thái đăng nhập
  const [user, setUser] = useState({
    email: localStorage.getItem('email') || null,
    userId: localStorage.getItem('userId') || null,
    role: localStorage.getItem('role') || null,
    fullName: localStorage.getItem('fullName') || null
  }); // Thông tin người dùng

  const login = (email, user, token) => {
    localStorage.setItem('auth-token', token);
    localStorage.setItem('email', email);
    localStorage.setItem('role', user.role);
    localStorage.setItem('userId', user.userId);
    localStorage.setItem('fullName', user.fullName);
    setIsAuthenticated(true); // Đánh dấu người dùng đã đăng nhập
    setUser({
      email,
      userId: user.userId,
      role: user.role,
      fullName: user.fullName
    }); // Lưu thông tin người dùng
  };

  const logout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.removeItem('fullName');
    setIsAuthenticated(false); // Đánh dấu người dùng đã đăng xuất
    setUser({}); // Xóa thông tin người dùng
  };

  return <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>{children}</AuthContext.Provider>;
};

// Hook để sử dụng context dễ dàng trong các component khác
export const useAuth = () => {
  return useContext(AuthContext);
};
