import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function SuperAdminProtectedRouter({ children }) {

  const { superAdminToken, superAdmin } = useSelector(
    (state) => state.superAdminAuth
  );

  console.log("superAdminToken:", superAdminToken);
  console.log("superAdmin:", superAdmin);

  if (!superAdminToken) {
    return <Navigate to="/superAdmin/login" replace />;
  }

  return children;
}

export default SuperAdminProtectedRouter;