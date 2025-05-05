import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import InboxPage from './pages/InboxPage';
import KeycloakLoginPage from './pages/KeycloakLoginPage';
import ProtectedRoute from './components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<KeycloakLoginPage />} />
      <Route path="/header" element={<Header />} />
      <Route
        path="/inbox"
        element={
          <ProtectedRoute>
            <InboxPage />
          </ProtectedRoute>
        }
      />
      <Route path="/unauthorized" element={<div><h2>Access Denied</h2></div>} />
    </Routes>
  );
};

export default AppRoutes;
