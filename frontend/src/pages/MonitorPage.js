import React, {useEffect, useState, useContext} from 'react';
import {
    Typography, CircularProgress, Box, Card, CardContent, Button, Grid, Alert,
} from '@mui/material';
import {AuthContext} from '../auth/AuthContext';
import {apiFetch} from '../api/api';
import DashboardLayout from '../components/DashboardLayout';

const MonitorPage = () => {
    const {token} = useContext(AuthContext);
    const [deployments, setDeployments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchDeployments = async () => {
        try {
            setLoading(true);
            const data = await apiFetch('/monitor', {
                headers: {Authorization: `Bearer ${token}`},
            });
            setDeployments(data);
        } catch (err) {
            setError('Failed to load deployments');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {

        try {
            await apiFetch(`/monitor/${id}/status`, {
                method: 'PATCH', headers: {Authorization: `Bearer ${token}`}, body: JSON.stringify({status})
            });

            await fetchDeployments();
        } catch (err) {
            setError(`Failed to ${status} container`);
        }
    };

    useEffect(() => {
        fetchDeployments();
    }, []);

    return (<DashboardLayout>
        <Typography variant="h4" gutterBottom>Service Monitor</Typography>

        {error && <Alert severity="error">{error}</Alert>}

        {loading ? (<CircularProgress/>) : (<Grid container spacing={3}>
            {deployments.map((d) => (<Grid item xs={12} md={6} key={d.id}>
                <Card variant="outlined" sx={{backgroundColor: '#f9f9f9'}}>
                    <CardContent>
                        <Typography variant="h6" fontWeight={600}>
                            {d.containerName}
                        </Typography>
                        <Typography color="text.secondary" fontSize={14}>
                            Image: {d.image}
                        </Typography>
                        <Typography fontSize={14}>Port: {d.port}</Typography>

                        <Box sx={{mt: 1}}>
                            <Typography variant="body2" color="text.secondary">
                                User: <strong>{d.user?.email}</strong>
                            </Typography>

                            <Typography variant="body2" sx={{mt: 0.5}}>
                                Status:{' '}
                                <span
                                    style={{
                                        fontWeight: 600, color: d.status === 'running' ? 'green' : 'gray',
                                    }}
                                >
          {d.status.toUpperCase()}
        </span>
                            </Typography>
                        </Box>

                        <Box sx={{display: 'flex', gap: 1, mt: 2}}>
                            <Button
                                size="small"
                                variant="contained"
                                onClick={() => updateStatus(d.id, 'restart')}
                            >
                                🔄 Restart
                            </Button>

                            <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                onClick={() => updateStatus(d.id, 'remove')}
                            >
                                ❌ Remove
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>))}
        </Grid>)}
    </DashboardLayout>);
};

export default MonitorPage;
