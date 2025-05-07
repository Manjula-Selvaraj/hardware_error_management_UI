import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import InboxPage from './pages/InboxPage';
import KeycloakLoginPage from './pages/KeycloakLoginPage';

const AppRoutes = () => {
  return (
    <Routes>

      <Route path="/" element={<KeycloakLoginPage />} />
      <Route path='/header' element={<Header />} />
      <Route path="/inbox" element={<InboxPage />} />

    </Routes>
  );
};

export default AppRoutes;
