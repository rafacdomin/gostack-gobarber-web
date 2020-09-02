import React from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';

import SignIn from '../pages/SignIn';

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={SignIn} />
      </Switch>
    </BrowserRouter>
  );
};

export default AppRoutes;
