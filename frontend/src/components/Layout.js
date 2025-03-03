import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { userService } from '../services/api';

const Layout = () => {
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const response = await userService.getBalance();
                setBalance(response.data || 0);
            } catch (error) {
                console.error('Error fetching balance:', error);
            }
        };

        fetchBalance();
    }, []);

    const updateBalance = async () => {
        try {
            const response = await userService.getBalance();
            setBalance(response.data || 0);
        } catch (error) {
            console.error('Error updating balance:', error);
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Navbar balance={balance} />
            <Sidebar />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    mt: 8,
                    width: { sm: `calc(100% - 240px)` }
                }}
            >
                <Outlet context={{ balance, setBalance, updateBalance }} />
            </Box>
        </Box>
    );
};

export default Layout; 