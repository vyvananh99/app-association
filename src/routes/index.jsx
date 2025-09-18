import { createBrowserRouter } from 'react-router-dom';

// project imports
import MainRoutes from './main-routes';
import LoginRoutes from './login-routes';
// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter([MainRoutes, LoginRoutes], { basename: import.meta.env.VITE_APP_BASE_NAME });

export default router;
