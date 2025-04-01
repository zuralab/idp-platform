import React from 'react';
import {Typography} from '@mui/material';
import DashboardLayout from '../components/DashboardLayout';

const DashboardPage = () => {
    return (
        <DashboardLayout>
            <Typography variant="h4">Welcome to the Developer Dashboard</Typography>
            <Typography sx={{mt: 2}}>You can view and deploy your services here.</Typography>
        </DashboardLayout>
    );
};

export default DashboardPage;
