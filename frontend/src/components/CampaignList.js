import React, { useState, useEffect } from 'react';
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, 
    TableRow, Paper, Switch, IconButton, Typography 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

const CampaignList = ({ onEdit, setNotification, setLoading }) => {
    const [campaigns, setCampaigns] = useState([]);

    const fetchCampaigns = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/campaigns`, {
                withCredentials: true
            });
            setCampaigns(response.data);
        } catch (error) {
            setNotification({
                open: true,
                message: 'Error fetching campaigns: ' + (error.response?.data?.message || 'Something went wrong'),
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            await axios.delete(`http://localhost:8080/api/campaigns/${id}`);
            setNotification({
                open: true,
                message: 'Campaign deleted successfully!',
                severity: 'success'
            });
            fetchCampaigns();
        } catch (error) {
            setNotification({
                open: true,
                message: 'Error deleting campaign: ' + (error.response?.data?.message || 'Something went wrong'),
                severity: 'error'
            });
            setLoading(false);
        }
    };

    const handleStatusChange = async (campaign) => {
        try {
            const updatedCampaign = { ...campaign, status: !campaign.status };
            await axios.put(`http://localhost:8080/api/campaigns/${campaign.id}`, updatedCampaign);
            fetchCampaigns();
        } catch (error) {
            setNotification({
                open: true,
                message: 'Error updating status: ' + (error.response?.data?.message || 'Something went wrong'),
                severity: 'error'
            });
        }
    };

    if (campaigns.length === 0) {
        return (
            <Typography variant="body1" sx={{ mt: 2 }}>
                No campaigns found. Create your first campaign!
            </Typography>
        );
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Keywords</TableCell>
                        <TableCell>Bid Amount</TableCell>
                        <TableCell>Campaign Fund</TableCell>
                        <TableCell>Town</TableCell>
                        <TableCell>Radius (km)</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {campaigns.map((campaign) => (
                        <TableRow key={campaign.id}>
                            <TableCell>{campaign.name}</TableCell>
                            <TableCell>{campaign.keywords}</TableCell>
                            <TableCell>${campaign.bidAmount}</TableCell>
                            <TableCell>${campaign.campaignFund}</TableCell>
                            <TableCell>{campaign.town}</TableCell>
                            <TableCell>{campaign.radius}</TableCell>
                            <TableCell>
                                <Switch
                                    checked={campaign.status}
                                    onChange={() => handleStatusChange(campaign)}
                                />
                            </TableCell>
                            <TableCell>
                                <IconButton onClick={() => onEdit(campaign)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDelete(campaign.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default CampaignList;
