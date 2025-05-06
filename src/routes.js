import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import InboxPage from './pages/InboxPage';
import KeycloakLoginPage from './pages/KeycloakLoginPage';
import JiraBoard from './pages/JiraBoard';
import ProtectedRoute from './pages/ProtectedRoute';
import Unauthorized from './pages/Unauthorized';

const AppRoutes = () => {
  return (
    <Routes>

      <Route path="/" element={<KeycloakLoginPage />} />
      <Route path='/header' element={<Header />} />
      <Route
      path="/inbox"
      element={
        <ProtectedRoute allowedRoles={['admin']}>
          <InboxPage />
        </ProtectedRoute>
      }
      
    />   
    <Route path="/unauthorized" element={<Unauthorized />} />
    <Route path="/jiraboard" element={<JiraBoard/>} />

    </Routes>
  );
};

export default AppRoutes;
