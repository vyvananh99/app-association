// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Định nghĩa ngôn ngữ mặc định và ngôn ngữ khác
const resources = {
  en: {
    translation: {
      welcome: 'Welcome',
      description: 'This is a React app with i18n integration',
      loginTitle: 'Login',
      username: 'Username',
      usernameInput: 'Enter username',
      usernameRequired: 'Username is required',
      password: 'Password',
      passwordInput: 'Enter password',
      passwordRequired: 'Password is required',
      loginServerError: 'Failed to login',
      loginInvalid: 'Incorrect username, password or Company Code'
    }
  },
  vi: {
    translation: {
      welcome: 'Chào mừng',
      description: 'Đây là một ứng dụng React tích hợp i18n',
      loginTitle: 'Đăng nhập',
      username: 'Tài khoản',
      usernameInput: 'Nhập tài khoản',
      usernameRequired: 'Phải nhập tài khoản',
      password: 'Mật khẩu',
      passwordInput: 'Nhập mật khẩu',
      passwordRequired: 'Phải nhập mật khẩu',
      loginServerError: 'Lỗi đăng nhập',
      loginInvalid: 'Tài khoản, mật khẩu hoặc Company Code không hợp lệ'
    }
  }
};

i18n
  .use(initReactI18next) // Sử dụng i18next cho React
  .init({
    resources,
    lng: 'en', // Ngôn ngữ mặc định
    interpolation: {
      escapeValue: false // React tự động escape giá trị
    }
  });

export default i18n;
