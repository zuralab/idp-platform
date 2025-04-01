import React, {useContext, useEffect, useState} from 'react';
import {
    Typography,
    CircularProgress,
    Box,
    IconButton,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    TableContainer,
    Alert,
    Tooltip,
    Snackbar,
    TextField,
    Grid,
    Container,
    Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {AuthContext} from '../auth/AuthContext';
import {apiFetch} from '../api/api';
import DashboardLayout from '../components/DashboardLayout';

const roles = ['developer', 'team_lead', 'admin'];

const AdminUsersPage = () => {
    const {token} = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [snackbar, setSnackbar] = useState({open: false, message: '', severity: 'success'});
    const [newUser, setNewUser] = useState({email: '', password: '', role: 'developer'});

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({open: true, message, severity});
    };

    const fetchUsers = async () => {
        try {
            const data = await apiFetch('/admin/users', {
                headers: {Authorization: `Bearer ${token}`},
            });
            setUsers(data);
        } catch (err) {
            setError('Failed to load users.');
        } finally {
            setLoading(false);
        }
    };

    const updateRole = async (id, role) => {
        try {
            await apiFetch(`/admin/user/${id}/role`, {
                method: 'PATCH',
                headers: {Authorization: `Bearer ${token}`},
                body: JSON.stringify({role}),
            });
            showSnackbar('Role updated');
            fetchUsers();
        } catch (err) {
            showSnackbar('Failed to update role', 'error');
        }
    };

    const deleteUser = async (id) => {
        try {
            await apiFetch(`/admin/user/${id}`, {
                method: 'DELETE',
                headers: {Authorization: `Bearer ${token}`},
            });
            fetchUsers();
            showSnackbar('User deleted');
        } catch (err) {
            showSnackbar('Failed to delete user', 'error');
        }
    };

    const createUser = async () => {
        const {email, password, role} = newUser;
        if (!email || !password) return showSnackbar('Email and password are required', 'error');

        try {
            await apiFetch(`/admin/create-user`, {
                method: 'POST',
                headers: {Authorization: `Bearer ${token}`},
                body: JSON.stringify({email, password, role}),
            });
            setNewUser({email: '', password: '', role: 'developer'});
            fetchUsers();
            showSnackbar('User created');
        } catch (err) {
            showSnackbar('Failed to create user', 'error');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <DashboardLayout>
            <Container maxWidth="lg" sx={{py: 4}}>
                <Typography variant="h4" gutterBottom>User Management</Typography>
                {error && <Alert severity="error">{error}</Alert>}

                <Box sx={{mb: 4}}>
                    <Typography variant="h6" gutterBottom>Create New User</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                label="Email"
                                size="small"
                                fullWidth
                                value={newUser.email}
                                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                label="Password"
                                size="small"
                                type="password"
                                fullWidth
                                value={newUser.password}
                                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Select
                                fullWidth
                                size="small"
                                value={newUser.role}
                                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                            >
                                {roles.map((r) => (
                                    <MenuItem key={r} value={r}>{r}</MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Button variant="contained" fullWidth onClick={createUser}>
                                Create User
                            </Button>
                        </Grid>
                    </Grid>
                </Box>

                {loading ? (
                    <CircularProgress/>
                ) : (
                    <TableContainer component={Paper} elevation={2} sx={{borderRadius: 2}}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((u) => (
                                    <TableRow key={u.id} hover sx={{'&:hover': {backgroundColor: '#f5f5f5'}}}>
                                        <TableCell>{u.email}</TableCell>
                                        <TableCell>
                                            <Select
                                                value={u.role}
                                                onChange={(e) => updateRole(u.id, e.target.value)}
                                                size="small"
                                            >
                                                {roles.map((r) => (
                                                    <MenuItem key={r} value={r}>
                                                        {r}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip title="Delete user">
                                                <IconButton color="error" onClick={() => deleteUser(u.id)}>
                                                    <DeleteIcon/>
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
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
        </DashboardLayout>
    );
};

export default AdminUsersPage;
