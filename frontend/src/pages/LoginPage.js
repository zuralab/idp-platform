import React, {useState, useContext, useEffect} from 'react';
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    Paper,
} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {AuthContext} from '../auth/AuthContext';
import {apiFetch} from '../api/api';

const LoginPage = () => {
    const {user, login} = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const data = await apiFetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({email, password}),
            });

            login(data.access_token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box mt={10}>
                <Paper elevation={3} sx={{padding: 4}}>
                    <Typography variant="h5" gutterBottom>
                        Developer Platform Login
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{mb: 2}}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Email"
                            variant="outlined"
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            variant="outlined"
                            margin="normal"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <Button type="submit" fullWidth variant="contained" sx={{mt: 2}}>
                            Log In
                        </Button>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
};

export default LoginPage;
