import React from 'react';

import { AuthProvider } from './contexts/auth';
import GlobalStyle from './styles/global';
import Routes from './routes';

function App() {
  return (
    <>
      <AuthProvider>
        <Routes />
      </AuthProvider>
      <GlobalStyle />
    </>
  );
}

export default App;
