import React, {useContext} from 'react';
import {Navigate} from 'react-router-dom';
import {AuthContext} from '../auth/AuthContext';

const ProtectedRoute = ({children}) => {
    const {user, token} = useContext(AuthContext);
    if (token && !user) return null;
    if (!token || !user) return <Navigate to="/login" replace/>;

    return children;
};

export default ProtectedRoute;
