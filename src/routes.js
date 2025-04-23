import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import KeycloakLoginPage from './pages/KeycloakLoginPage';
import InboxPage from './pages/InboxPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<KeycloakLoginPage />} />
      
        <Route path="/inbox" element={<InboxPage />} />
       
    </Routes>
  );
};

export default AppRoutes;
