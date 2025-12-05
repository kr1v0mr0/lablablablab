import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoute = ({ children }) => {
    const token = useSelector((state) => state.auth.accessToken);
    if (token) {
        return <Navigate to="/main" replace />;
    }
    return children;
};

export default PublicRoute;