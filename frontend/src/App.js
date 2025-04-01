import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './routes/ProtectedRoute';
import {AuthProvider} from './auth/AuthContext';
import MonitorPage from './pages/MonitorPage';
import AdminUsersPage from './pages/AdminUsersPage';
import RoleBasedDashboard from './pages/RoleBasedDashboard';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage/>}/>

                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <RoleBasedDashboard/>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/monitor"
                        element={
                            <ProtectedRoute allowedRoles={['team_lead', 'admin']}>
                                <MonitorPage/>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/users"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <AdminUsersPage/>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
