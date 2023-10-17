import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PublicRoute({ children }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (token) {
    if (role) {
      return <Navigate to={`/${role}/overview`} />;
    } else {
      return <Navigate to="/" />;
    }
  } else {
    return children;
  }
}
