/* eslint-disable unicode-bom */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProtectedRoute from './components/ProtectedRoute';
import Campaigns from './pages/Campaigns';

const theme = createTheme();

// PrivateRoute component
const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <Router>
                    <Routes>
                        {}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        
                        {}
                        <Route element={<Layout />}>
                            <Route
                                path="/dashboard"
                                element={
                                    <PrivateRoute>
                                        <Dashboard />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/products"
                                element={
                                    <PrivateRoute>
                                        <Products />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/campaigns"
                                element={
                                    <PrivateRoute>
                                        <Campaigns />
                                    </PrivateRoute>
                                }
                            />
                        </Route>

                        {}
                        <Route
                            path="/"
                            element={
                                <PrivateRoute>
                                    <Navigate to="/dashboard" replace />
                                </PrivateRoute>
                            }
                        />

                        {}
                        <Route
                            path="*"
                            element={
                                <PrivateRoute>
                                    <Navigate to="/dashboard" replace />
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
