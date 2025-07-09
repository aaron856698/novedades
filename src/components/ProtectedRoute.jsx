import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const session = JSON.parse(localStorage.getItem('session'));
  if (!session || !session.username) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute; 