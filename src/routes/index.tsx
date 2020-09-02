import React from 'react';
import { useAuth } from '../contexts/auth';

import AppRoutes from './app.routes';
import AuthRoutes from './auth.routes';

const Routes: React.FC = () => {
  const signed = !!useAuth().user;

  return signed ? <AppRoutes /> : <AuthRoutes />;
};

export default Routes;
