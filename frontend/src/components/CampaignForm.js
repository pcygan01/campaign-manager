import React, { useState, useEffect } from 'react';
import {
    TextField, Button, Box, FormControl, InputLabel,
    Select, MenuItem, FormControlLabel, Switch,
    Typography, InputAdornment, Paper, Grid,
    Autocomplete, Divider
} from '@mui/material';
import axios from 'axios';

const CampaignForm = ({ campaign, onSubmit, onCancel, setLoading, setNotification }) => {
    const [formData, setFormData] = useState({
        name: '',
        keywords: '',
        bidAmount: '',
        campaignFund: '',
        status: true,
        town: '',
        radius: '',
        productName: '',
        productPrice: '',
        productDescription: ''
    });

    const [accountBalance, setAccountBalance] = useState(10000);
    const [suggestedKeywords] = useState([
        'Electronics', 'Fashion', 'Home & Garden', 'Sports',
        'Books', 'Toys', 'Beauty', 'Automotive', 'Health'
    ]);

    const towns = [
        'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix',
        'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'
    ];

    useEffect(() => {
        if (campaign) {
            setFormData(campaign);
        }
    }, [campaign]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleKeywordsChange = (event, newValue) => {
        setFormData(prev => ({
            ...prev,
            keywords: Array.isArray(newValue) ? newValue.join(', ') : newValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (parseFloat(formData.campaignFund) > accountBalance) {
            setNotification({
                open: true,
                message: 'Insufficient funds in your account',
                severity: 'error'
            });
            setLoading(false);
            return;
        }

        try {
            const payload = {
                ...formData,
                bidAmount: parseFloat(formData.bidAmount),
                campaignFund: parseFloat(formData.campaignFund),
                radius: parseInt(formData.radius),
                productPrice: parseFloat(formData.productPrice),
                status: Boolean(formData.status)
            };

            if (campaign) {
                await axios.put(`http://localhost:8080/api/campaigns/${campaign.id}`, payload);
            } else {
                await axios.post('http://localhost:8080/api/campaigns', payload);
            }

            setAccountBalance(prev => prev - parseFloat(formData.campaignFund));
            
            onSubmit();
            setNotification({
                open: true,
                message: `Campaign ${campaign ? 'updated' : 'created'} successfully!`,
                severity: 'success'
            });
        } catch (error) {
            setNotification({
                open: true,
                message: `Error: ${error.response?.data?.message || error.message}`,
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
            <Box component="form" onSubmit={handleSubmit}>
                <Typography variant="h6" gutterBottom color="primary">
                    {campaign ? 'Edit Campaign' : 'Create New Campaign'}
                </Typography>

                <Box sx={{ mb: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Available Balance: ${accountBalance.toFixed(2)}
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {}
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                            Product Information
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            required
                            name="productName"
                            label="Product Name"
                            value={formData.productName}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            required
                            name="productPrice"
                            label="Product Price"
                            type="number"
                            value={formData.productPrice}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                inputProps: { min: 0, step: "0.01" }
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            name="productDescription"
                            label="Product Description"
                            value={formData.productDescription}
                            onChange={handleChange}
                        />
                    </Grid>

                    {}
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                            Campaign Information
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            required
                            name="name"
                            label="Campaign Name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Autocomplete
                            multiple
                            freeSolo
                            options={suggestedKeywords}
                            value={formData.keywords.split(',').map(k => k.trim()).filter(k => k)}
                            onChange={handleKeywordsChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    required
                                    label="Keywords"
                                    helperText="Press Enter to add multiple keywords"
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            required
                            name="bidAmount"
                            label="Bid Amount"
                            type="number"
                            value={formData.bidAmount}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                inputProps: { min: 1, step: "0.01" }
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            required
                            name="campaignFund"
                            label="Campaign Fund"
                            type="number"
                            value={formData.campaignFund}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                inputProps: { min: 1, step: "0.01" }
                            }}
                            helperText={`Maximum available: $${accountBalance}`}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth required>
                            <InputLabel>Town</InputLabel>
                            <Select
                                name="town"
                                value={formData.town}
                                onChange={handleChange}
                                label="Town"
                            >
                                {towns.map(town => (
                                    <MenuItem key={town} value={town}>{town}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            required
                            name="radius"
                            label="Radius (km)"
                            type="number"
                            value={formData.radius}
                            onChange={handleChange}
                            InputProps={{
                                inputProps: { min: 1 }
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.status}
                                    onChange={(e) => handleChange({
                                        target: {
                                            name: 'status',
                                            value: e.target.checked
                                        }
                                    })}
                                    name="status"
                                />
                            }
                            label={formData.status ? "Campaign Active" : "Campaign Inactive"}
                        />
                    </Grid>
                </Grid>

                <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button variant="outlined" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="primary">
                        {campaign ? 'Update Campaign' : 'Create Campaign'}
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

export default CampaignForm;
