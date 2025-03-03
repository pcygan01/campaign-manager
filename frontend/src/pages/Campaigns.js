import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Grid,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  TextField,
  Select,
  MenuItem,
} from '@mui/material';
import { productService, campaignService, userService } from '../services/api';
import CampaignCard from '../components/CampaignCard';
import AddCampaignDialog from '../components/AddCampaignDialog';
import { useOutletContext } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

export default function Campaigns() {
  const { setBalance, updateBalance } = useOutletContext();
  const [campaignsList, setCampaignsList] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [campaignsResponse, productsResponse] = await Promise.all([
        campaignService.getSellerCampaigns(),
        productService.getSellerProducts()
      ]);
      
      setCampaignsList(campaignsResponse?.data || []);
      setProductsList(productsResponse?.data || []);
      setError(null);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, severity) => {
    setAlert({ open: true, message: message.toString(), severity });
  };

  const handleEdit = (campaign) => {
    setEditingCampaign(campaign);
    setOpenDialog(true);
  };

  const handleAddNew = () => {
    setEditingCampaign(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCampaign(null);
  };

  const handleSubmit = async (campaignData) => {
    try {
      setLoading(true);
      
      let updatedCampaign;
      if (campaignData.id) {
        try {
          const response = await campaignService.updateCampaign(campaignData.id, campaignData);
          updatedCampaign = response?.data;
        } catch (error) {
          if (error.response?.data?.message === "Campaign not found") {
            showAlert("This campaign no longer exists. It may have been deleted.", 'error');
            handleCloseDialog();
            loadData(); // Refresh the list
            return;
          }
          throw error;
        }
        
        setCampaignsList(campaignsList.map(c => c.id === updatedCampaign.id ? updatedCampaign : c));
        showAlert('Campaign updated successfully', 'success');
      } else {
        const response = await campaignService.createCampaign(campaignData);
        updatedCampaign = response?.data;
        
        if (!updatedCampaign) {
          console.error('No data returned from createCampaign:', response);
          throw new Error('No data returned from server');
        }
        
        setCampaignsList([...campaignsList, updatedCampaign]);
        showAlert('Campaign created successfully', 'success');
      }
      
      try {
        const balanceResponse = await userService.getBalance();
        if (typeof setBalance === 'function') {
          setBalance(balanceResponse.data);
        }
      } catch (balanceError) {
        console.error('Error updating balance:', balanceError);
      }
      
      setOpenDialog(false);
      
      loadData();
    } catch (error) {
      console.error('Error saving campaign:', error);
      showAlert(`Error: ${error.response?.data?.message || error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await campaignService.deleteCampaign(id);
      showAlert('Campaign deleted successfully', 'success');
      loadData();
      setBalance(prevBalance => prevBalance + (editingCampaign?.campaignFund || 0));
      updateBalance();
    } catch (error) {
      showAlert('Failed to delete campaign', 'error');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4} color="error.main">
        <Typography>{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          gap: 3, 
          mb: 4, 
          p: 2, 
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 1
        }}
      >
        <Box>
          <Typography color="text.secondary" variant="body2">Total Campaigns</Typography>
          <Typography variant="h6">{campaignsList.length}</Typography>
        </Box>
        <Box>
          <Typography color="text.secondary" variant="body2">Active Campaigns</Typography>
          <Typography variant="h6" color="success.main">
            {campaignsList.filter(c => c.status).length}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          size="small"
          placeholder="Search campaigns..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
        />
        <Select
          size="small"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          sx={{ width: 150 }}
        >
          <MenuItem value="all">All Status</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </Select>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Campaigns</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleAddNew}
        >
          Add New Campaign
        </Button>
      </Box>

      {productsList.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" gutterBottom>
            You need to add products before creating campaigns
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            href="/products"
          >
            Add Products First
          </Button>
        </Box>
      ) : campaignsList.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" gutterBottom>
            No campaigns found
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleAddNew}
          >
            Create Your First Campaign
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {campaignsList
            .filter(campaign => 
              campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
              (filterStatus === 'all' || 
               (filterStatus === 'active' && campaign.status) ||
               (filterStatus === 'inactive' && !campaign.status))
            )
            .map((campaign) => (
              <Grid item xs={12} sm={6} md={4} key={campaign.id}>
                <CampaignCard 
                  campaign={campaign}
                  products={productsList}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              </Grid>
            ))}
        </Grid>
      )}

      <AddCampaignDialog 
        open={openDialog}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        products={productsList}
        campaign={editingCampaign}
        setNavbarBalance={setBalance}
      />

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 