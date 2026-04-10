import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function AdminProtectedRouter({
  children,
  allowedHosts = [],
}) {
  const { adminToken, loading } = useSelector(
    (state) => state.adminAuth
  );

  const { admin } = useSelector((state) => state.admin);

  if (loading) {
    return <div>Loading...</div>;
  }

  const authToken =
    adminToken || localStorage.getItem("adminToken");

  // Not logged in
  if (!authToken) {
    return <Navigate to="/loginPage" replace />;
  }

  // Prevent access if host is not allowed
  if (
    allowedHosts.length > 0 &&
    !allowedHosts.includes(admin?.host)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default AdminProtectedRouter;




// import React from 'react'
// import { useSelector } from 'react-redux'
// import { Navigate } from 'react-router-dom';

// function AdminProtectedRouter({children}) {
//   const {adminToken, loading} = useSelector((state) => state.adminAuth)
//   const {admin} = useSelector((state) => state.admin)


//   console.log("adminToken", adminToken);
//   // console.log("admin", admin);

//   if(loading){
//     return <div>Loading...</div>;
//   }

//   const authToken = adminToken || localStorage.getItem("adminToken")

//   if(!authToken){
//     return <Navigate to="/loginPage" replace/>
//   }


//   return children
// }

// export default AdminProtectedRouter