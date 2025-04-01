import React, {useContext, useState, useEffect} from 'react';
import {
    Container,
    Typography,
    Paper,
    Box,
    Grid,
    TextField,
    Button,
    Snackbar,
    Alert,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    IconButton,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions, ListItemIcon,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DashboardLayout from '../../components/DashboardLayout';
import {AuthContext} from '../../auth/AuthContext';
import {apiFetch} from '../../api/api';
import CreateDeploymentForm from "../../components/CreateDeploymentForm";
import DeploymentList from "../../components/DeploymentList";

const DeveloperDashboard = () => {
    const {token} = useContext(AuthContext);
    const [form, setForm] = useState({containerName: '', image: '', port: ''});
    const [snackbar, setSnackbar] = useState({open: false, message: '', severity: 'success'});
    const [deployments, setDeployments] = useState([]);
    const [loading, setLoading] = useState(true);

    const [logsOpen, setLogsOpen] = useState(false);
    const [logs, setLogs] = useState('');
    const [selectedId, setSelectedId] = useState(null);

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({open: true, message, severity});
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm((prev) => ({...prev, [name]: value}));
    };

    const openLogs = async (id) => {
        try {
            const res = await apiFetch(`/deploy/${id}/logs`, {
                headers: {Authorization: `Bearer ${token}`},
            });
            setLogs(
                Array.isArray(res)
                    ? res.map(log => `[${log.timestamp}] ${log.message}`).join('\n')
                    : 'No logs available'
            );
            setSelectedId(id);
            setLogsOpen(true);
        } catch (err) {
            console.error('Failed to fetch logs', err);
            setLogs('Error loading logs');
            setLogsOpen(true);
        }
    };

    const handleSubmit = async () => {
        const {containerName, image, port} = form;
        if (!containerName || !image || !port) {
            return showSnackbar('All fields are required', 'error');
        }

        try {
            await apiFetch('/deploy', {
                method: 'POST',
                headers: {Authorization: `Bearer ${token}`},
                body: JSON.stringify({containerName, image, port: parseInt(port)}),
            });
            setForm({containerName: '', image: '', port: ''});
            showSnackbar('Deployment created!');
            fetchDeployments();
        } catch (err) {
            showSnackbar('Failed to deploy', 'error');
        }
    };

    const fetchDeployments = async () => {
        setLoading(true);
        try {
            const data = await apiFetch('/deploy', {
                headers: {Authorization: `Bearer ${token}`},
            });
            setDeployments(data);
        } catch (err) {
            console.error('Failed to fetch deployments');
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

    useEffect(() => {
        fetchDeployments();
    }, []);

    return (<DashboardLayout>
        <Container maxWidth="lg" sx={{py: 4}}>
            <Typography variant="h4" gutterBottom>
                Developer Dashboard
            </Typography>

            <CreateDeploymentForm onSuccess={fetchDeployments}/>

            <Dialog open={logsOpen} onClose={() => setLogsOpen(false)} fullWidth>
                <DialogTitle>Deployment Logs</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" style={{whiteSpace: 'pre-wrap'}}>
                        {logs}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setLogsOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            <Typography variant="h6" gutterBottom>My Deployments</Typography>
            {loading ? (
                <CircularProgress/>
            ) : (
                <DeploymentList
                    deployments={deployments}
                    onLogClick={openLogs}
                    onStatusChange={updateStatus}
                />
            )}

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

export default DeveloperDashboard;
