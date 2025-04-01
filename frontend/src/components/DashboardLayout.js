import React, {useState, useContext} from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Box,
    Button,
    IconButton,
    Divider,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {useNavigate} from 'react-router-dom';
import {AuthContext} from '../auth/AuthContext';

const drawerWidth = 240;

const DashboardLayout = ({children}) => {
    const {user, logout} = useContext(AuthContext);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);

    const navItems = [
        {label: 'Dashboard', path: '/dashboard', roles: ['developer', 'team_lead', 'admin']},
        {label: 'Monitor', path: '/monitor', roles: ['team_lead']},
        {label: 'Users', path: '/admin/users', roles: ['admin']},
    ];

    const allowedNav = navItems.filter(item => item.roles.includes(user?.role));

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const drawerContent = (
        <Box onClick={() => isMobile && setMobileOpen(false)}>
            <Toolbar>
                <Typography variant="h6">Menu</Typography>
            </Toolbar>
            <Divider/>
            <List>
                {allowedNav.map((item) => (
                    <ListItem key={item.label} disablePadding>
                        <ListItemButton onClick={() => navigate(item.path)}>
                            <ListItemText primary={item.label}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{display: 'flex'}}>
            {/* AppBar */}
            <AppBar position="fixed" sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}>
                <Toolbar sx={{justifyContent: 'space-between'}}>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        {isMobile && (
                            <IconButton
                                color="inherit"
                                edge="start"
                                onClick={() => setMobileOpen(!mobileOpen)}
                                sx={{mr: 2}}
                            >
                                <MenuIcon/>
                            </IconButton>
                        )}
                        <Typography variant="h6">IDP Platform</Typography>
                    </Box>
                    <Box>
                        <Typography variant="body1" sx={{mr: 2, display: 'inline'}}>
                            {user?.email} ({user?.role})
                        </Typography>
                        <Button color="inherit" onClick={handleLogout}>Logout</Button>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Drawer */}
            <Box component="nav" sx={{width: {md: drawerWidth}, flexShrink: {md: 0}}}>
                {/* Temporary drawer for mobile */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    ModalProps={{keepMounted: true}}
                    sx={{
                        display: {xs: 'block', md: 'none'},
                        '& .MuiDrawer-paper': {width: drawerWidth},
                    }}
                >
                    {drawerContent}
                </Drawer>

                {/* Permanent drawer for desktop */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: {xs: 'none', md: 'block'},
                        '& .MuiDrawer-paper': {width: drawerWidth, boxSizing: 'border-box'},
                    }}
                    open
                >
                    {drawerContent}
                </Drawer>
            </Box>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: {md: `calc(100% - ${drawerWidth}px)`},
                }}
            >
                <Toolbar/>
                {children}
            </Box>
        </Box>
    );
};

export default DashboardLayout;
