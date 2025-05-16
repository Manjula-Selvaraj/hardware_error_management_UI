import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import InboxPage from './pages/InboxPage';
import KeycloakLoginPage from './pages/KeycloakLoginPage';

import ProtectedRoute from './pages/ProtectedRoute';
import Unauthorized from './pages/Unauthorized';
const AppRoutes = () => {
  return (
    <Routes>

      <Route path="/" element={<KeycloakLoginPage />} />
      <Route path='/header' element={<Header />} />

      <Route
        path="/tasklist"
        element={
          <ProtectedRoute allowedRoles={['tasklist']}>
            <InboxPage />
          </ProtectedRoute>
        }

      />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/inbox" element={<InboxPage />} />

    </Routes>
  );
};

export default AppRoutes;
