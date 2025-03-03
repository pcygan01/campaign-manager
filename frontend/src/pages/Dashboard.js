import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Grid, 
    CircularProgress, 
    Button, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    TextField, 
    Alert,
    Paper
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/api';
import { useOutletContext } from 'react-router-dom';

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const { updateBalance } = useOutletContext();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCampaigns: 0,
    balance: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openFundsDialog, setOpenFundsDialog] = useState(false);
  const [amount, setAmount] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const stats = await userService.getStats();
        setStats(stats);
        setError(null);
      } catch (error) {
        console.error('Error loading stats:', error);
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };
    
    if (isAuthenticated) {
      loadStats();
    }
  }, [isAuthenticated]);

  const handleAddFunds = async () => {
    try {
      const response = await userService.addBalance(parseFloat(amount));
      const newBalance = response.data;
      setStats(prev => ({
        ...prev,
        balance: newBalance
      }));
      updateBalance();
      setOpenFundsDialog(false);
      setAlert({ 
        show: true, 
        message: `Successfully added ${amount} PLN to your account`, 
        severity: 'success' 
      });
      setAmount('');
    } catch (error) {
      setAlert({ 
        show: true, 
        message: error.response?.data?.message || 'Failed to add funds', 
        severity: 'error' 
      });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Alert severity="error" variant="filled">
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: 'lg', mx: 'auto' }}>
      {alert.show && (
        <Alert 
          severity={alert.severity} 
          sx={{ 
            mb: 3,
            borderRadius: 1,
            backgroundColor: alert.severity === 'success' ? '#e8f5e9' : undefined
          }}
          onClose={() => setAlert({ ...alert, show: false })}
        >
          {alert.message}
        </Alert>
      )}
      
      <Typography variant="h3" component="h1" sx={{ mb: 1 }}>
        Welcome,
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Here's an overview of your account
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={1}
            sx={{ 
              p: 3,
              borderRadius: 1,
              backgroundColor: 'white',
              height: '100%'
            }}
          >
            <Box sx={{ mb: 2 }}>
              <Typography 
                variant="subtitle1" 
                component="div"
                color="#1976d2" 
                sx={{ fontSize: '1.25rem', mb: 1 }}
              >
                Account Balance
              </Typography>
              <Typography variant="h3" component="div" sx={{ color: '#1976d2', fontWeight: 500 }}>
                {stats.balance.toFixed(2)} PLN
              </Typography>
            </Box>
            <Button 
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenFundsDialog(true)}
              sx={{
                width: '100%',
                backgroundColor: '#1976d2',
                color: 'white',
                textTransform: 'none',
                py: 1.5,
                '&:hover': {
                  backgroundColor: '#1565c0'
                }
              }}
            >
              Add Funds
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper 
            elevation={1}
            sx={{ 
              p: 3,
              borderRadius: 1,
              backgroundColor: 'white',
              height: '100%'
            }}
          >
            <Typography 
              variant="subtitle1" 
              component="div"
              color="#1976d2" 
              sx={{ fontSize: '1.25rem', mb: 1 }}
            >
              Total Products
            </Typography>
            <Typography variant="h3" component="div" sx={{ color: '#1976d2', fontWeight: 500 }}>
              {stats.totalProducts}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper 
            elevation={1}
            sx={{ 
              p: 3,
              borderRadius: 1,
              backgroundColor: 'white',
              height: '100%'
            }}
          >
            <Typography 
              variant="subtitle1" 
              component="div"
              color="#2e7d32" 
              sx={{ fontSize: '1.25rem', mb: 1 }}
            >
              Total Campaigns
            </Typography>
            <Typography variant="h3" component="div" sx={{ color: '#2e7d32', fontWeight: 500 }}>
              {stats.totalCampaigns}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={openFundsDialog}
        onClose={() => setOpenFundsDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 1,
            width: '100%',
            maxWidth: '400px'
          }
        }}
      >
        <DialogTitle>Add Funds</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Amount (PLN)"
            type="number"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputProps={{ min: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFundsDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddFunds} 
            variant="contained"
            sx={{ backgroundColor: '#1976d2' }}
          >
            Add Funds
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard; 