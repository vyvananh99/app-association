import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthLogin from 'sections/auth/AuthLogin';

import { useAuth } from 'contexts/AuthContext';

import { loginApi } from 'api/auth.api';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify'; // Optional, for showing error messages
// ================================|| JWT - LOGIN ||================================ //

export default function Login() {
  const { t } = useTranslation();
  const { login, isAuthenticated } = useAuth();
  const [loginLoading, setLoginLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (email, password, comId) => {
    setLoginLoading(true);
    try {
      const loginResult = await loginApi(email, password, comId);
      if (loginResult.isSuccess) {
        login(email, loginResult.user, loginResult.token);
        navigate('/');
      } else {
        toast.error(t('loginInvalid'));
      }
    } catch {
      toast.error(t('loginServerError'));
    }
    setLoginLoading(false);
  };

  useEffect(() => {
    // Redirect to home page if already authenticated
    if (localStorage.getItem('auth-token') && isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated]);

  const handleGoogleLogin = async () => {
    window.location.href = 'http://localhost:3000/auth/google';
  };

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Stack direction="row" sx={{ alignItems: 'baseline', justifyContent: 'space-between', mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">{t('loginTitle')}</Typography>
            {/* <Typography component={Link} to={'/register'} variant="body1" sx={{ textDecoration: 'none' }} color="primary">
              Don&apos;t have an account?
            </Typography> */}
          </Stack>
        </Grid>
        <Grid size={12}>
          <AuthLogin handleLogin={handleLogin} handleGoogleLogin={handleGoogleLogin}loginLoading={loginLoading} />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
