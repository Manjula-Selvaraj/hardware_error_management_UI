import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import InboxPage from "./pages/InboxPage";
import KeycloakLoginPage from "./pages/KeycloakLoginPage";

import ProtectedRoute from "./pages/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";
import GroupCheckRoute from "./pages/GroupCheckRoute ";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<KeycloakLoginPage />} />
      <Route path="/header" element={<Header />} />
      <Route path="/groupCheck" element={<GroupCheckRoute />} />

      <Route
        path="/tasklist"
        element={
          <ProtectedRoute allowedRoles={["Tasklist"]}>
            <InboxPage />
          </ProtectedRoute>
        }
      />
      <Route path="/unauthorized" element={<Unauthorized />} />

    </Routes>
  );
};

export default AppRoutes;
