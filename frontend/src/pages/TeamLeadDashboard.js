import React, {useEffect, useState, useContext} from 'react';
import {
    Container,
    Typography,
    CircularProgress,
    Paper,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Snackbar,
    Alert
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import DashboardLayout from '../components/DashboardLayout';
import {apiFetch} from '../api/api';
import {AuthContext} from '../auth/AuthContext';

const TeamLeadDashboard = () => {
    const {token} = useContext(AuthContext);
    const [deployments, setDeployments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [logsOpen, setLogsOpen] = useState(false);
    const [logs, setLogs] = useState('');
    const [snackbar, setSnackbar] = useState({open: false, message: '', severity: 'success'});

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({open: true, message, severity});
    };

    const fetchDeployments = async () => {
        try {
            const res = await apiFetch('/monitor', {
                headers: {Authorization: `Bearer ${token}`},
            });
            setDeployments(res);
        } catch (err) {
            showSnackbar('Failed to load deployments', 'error');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await apiFetch(`/monitor/${id}/status`, {
                method: 'PATCH', headers: {Authorization: `Bearer ${token}`}, body: JSON.stringify({status}),
            });
            showSnackbar(`Deployment ${status}ed`);
            fetchDeployments();
        } catch (err) {
            showSnackbar(`Failed to ${status}`, 'error');
        }
    };

    const fetchLogs = async (id) => {
        try {
            const res = await apiFetch(`/deploy/${id}/logs`, {
                headers: {Authorization: `Bearer ${token}`},
            });
            setLogs(Array.isArray(res) ? res.map(log => `[${log.timestamp}] ${log.message}`).join('\n') : 'No logs available');
            setLogsOpen(true);
        } catch (err) {
            setLogs('Error loading logs');
            setLogsOpen(true);
        }
    };

    useEffect(() => {
        fetchDeployments();
    }, []);

    return (<DashboardLayout>
            <Container maxWidth="lg" sx={{py: 4}}>
                <Typography variant="h4" gutterBottom>
                    Team Lead Dashboard
                </Typography>

                {loading ? <CircularProgress/> : (<Paper sx={{mt: 2}}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Container</TableCell>
                                    <TableCell>Image</TableCell>
                                    <TableCell>Port</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>User</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {deployments.map((d) => (<TableRow key={d.id}>
                                        <TableCell>{d.containerName}</TableCell>
                                        <TableCell>{d.image}</TableCell>
                                        <TableCell>{d.port}</TableCell>
                                        <TableCell>{d.status}</TableCell>
                                        <TableCell>{d.user?.email}</TableCell>
                                        <TableCell>
                                            <IconButton color="primary" onClick={() => fetchLogs(d.id)}>Log</IconButton>
                                            <IconButton color="primary"
                                                        onClick={() => updateStatus(d.id, 'restart')}><RestartAltIcon/></IconButton>
                                            <IconButton color="error"
                                                        onClick={() => updateStatus(d.id, 'remove')}><DeleteIcon/></IconButton>
                                        </TableCell>
                                    </TableRow>))}
                            </TableBody>
                        </Table>
                    </Paper>)}

                <Dialog open={logsOpen} onClose={() => setLogsOpen(false)} fullWidth>
                    <DialogTitle>Logs</DialogTitle>
                    <DialogContent>
                        <Typography variant="body2" style={{whiteSpace: 'pre-wrap'}}>
                            {logs}
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setLogsOpen(false)}>Close</Button>
                    </DialogActions>
                </Dialog>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={() => setSnackbar({...snackbar, open: false})}
                    anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                >
                    <Alert severity={snackbar.severity} sx={{width: '100%'}}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
        </DashboardLayout>);
};

export default TeamLeadDashboard;
