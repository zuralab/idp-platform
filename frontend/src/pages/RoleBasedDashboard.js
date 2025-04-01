import React, {useContext} from 'react';
import {Navigate} from 'react-router-dom';
import {AuthContext} from '../auth/AuthContext';
import DeveloperDashboard from './developer/DeveloperDashboard';
import TeamLeadDashboard from './TeamLeadDashboard';
import AdminUsersPage from './AdminUsersPage';

const RoleBasedDashboard = () => {
    const {user} = useContext(AuthContext);

    if (!user) return <Navigate to="/login" replace/>;

    switch (user.role) {
        case 'developer':
            console.log('DeveloperDashboard');
            return <DeveloperDashboard/>;
        case 'team_lead':
            return <TeamLeadDashboard/>;
        case 'admin':
            return <AdminUsersPage/>;
        default:
            return <Navigate to="/login" replace/>;
    }
};

export default RoleBasedDashboard;
