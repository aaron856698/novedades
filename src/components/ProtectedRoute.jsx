import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  let session = null;
  try {
    const raw = localStorage.getItem('session');
    session = raw ? JSON.parse(raw) : null;
  } catch (_) {
    session = null;
  }
  if (!session || !session.username) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute; 
