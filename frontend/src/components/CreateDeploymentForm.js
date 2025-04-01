import React, {useState, useContext} from 'react';
import {
    TextField, Button, Paper, Typography, Grid, Snackbar, Alert
} from '@mui/material';
import {AuthContext} from '../auth/AuthContext';
import {apiFetch} from '../api/api';

const CreateDeploymentForm = ({onSuccess}) => {
    const {token} = useContext(AuthContext);
    const [form, setForm] = useState({
        containerName: '', image: '', port: '',
    });

    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState({open: false, message: '', severity: 'success'});

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await apiFetch('/deploy', {
                method: 'POST', headers: {Authorization: `Bearer ${token}`}, body: JSON.stringify({
                    containerName: form.containerName, image: form.image, port: Number(form.port),
                }),
            });

            setFeedback({open: true, message: 'Deployment created successfully!', severity: 'success'});
            setForm({containerName: '', image: '', port: ''});
            if (onSuccess) onSuccess();
        } catch (err) {
            setFeedback({open: true, message: 'Failed to create deployment', severity: 'error'});
        } finally {
            setLoading(false);
        }
    };

    return (<Paper elevation={3} sx={{p: 4, mb: 4}}>
        <Typography variant="h6" gutterBottom>
            Create New Deployment
        </Typography>

        <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        label="Container Name"
                        name="containerName"
                        value={form.containerName}
                        onChange={handleChange}
                        required
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        label="Docker Image"
                        name="image"
                        value={form.image}
                        onChange={handleChange}
                        required
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        label="Port"
                        name="port"
                        value={form.port}
                        onChange={handleChange}
                        type="number"
                        required
                    />
                </Grid>

                <Grid item xs={12} display="flex" justifyContent="flex-end">
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        sx={{minWidth: 150}}
                    >
                        {loading ? 'Deploying...' : 'Create Deployment'}
                    </Button>
                </Grid>
            </Grid>
        </form>

        <Snackbar
            open={feedback.open}
            autoHideDuration={3000}
            onClose={() => setFeedback({...feedback, open: false})}
        >
            <Alert
                onClose={() => setFeedback({...feedback, open: false})}
                severity={feedback.severity}
                sx={{width: '100%'}}
            >
                {feedback.message}
            </Alert>
        </Snackbar>
    </Paper>);
};

export default CreateDeploymentForm;
