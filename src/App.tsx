import React from 'react';

import GlobalStyle from './styles/global';
import Routes from './routes';
import AppProvider from './contexts';

function App() {
  return (
    <>
      <AppProvider>
        <Routes />
      </AppProvider>

      <GlobalStyle />
    </>
  );
}

export default App;
