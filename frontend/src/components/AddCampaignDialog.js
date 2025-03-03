import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    MenuItem,
    FormControlLabel,
    Switch,
    Alert,
    FormControl,
    InputLabel,
    Select,
    FormHelperText,
    Autocomplete,
    Chip
} from '@mui/material';
import { userService, townService } from '../services/api';

const AddCampaignDialog = ({ open, onClose, onSubmit, products, campaign, setNavbarBalance }) => {
    const [formData, setFormData] = useState({
        name: '',
        keywords: [],
        radius: '',
        bidAmount: '',
        campaignFund: '',
        productId: '',
        status: true,
        town: ''
    });
    const [errors, setErrors] = useState({});
    const [currentBalance, setCurrentBalance] = useState(0);
    const [maxCampaignFund, setMaxCampaignFund] = useState(0);
    const [towns, setTowns] = useState([]);
    const [isLoadingTowns, setIsLoadingTowns] = useState(true);

    const suggestedKeywords = [
        'chocolate', 'candy', 'sweets', 'snacks', 'food',
        'drinks', 'coffee', 'tea', 'dessert', 'organic',
        'healthy', 'vegan', 'gluten-free', 'natural', 'fresh',
        'homemade', 'traditional', 'premium', 'luxury', 'gift'
    ];

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const response = await userService.getBalance();
                const userBalance = response.data;
                setCurrentBalance(userBalance);
                
                if (campaign && campaign.campaignFund) {
                    setMaxCampaignFund(campaign.campaignFund + userBalance);
                } else {
                    setMaxCampaignFund(userBalance);
                }
            } catch (error) {
                console.error('Error fetching balance:', error);
            }
        };
        
        fetchBalance();
    }, [campaign]);

    useEffect(() => {
        const loadTowns = async () => {
            if (open) {
                setIsLoadingTowns(true);
                try {
                    const response = await townService.getAllTowns();
                    const formattedTowns = response.data.map(town => ({
                        value: town,
                        label: town.charAt(0) + town.slice(1).toLowerCase()
                    }));
                    setTowns(formattedTowns);
                } catch (error) {
                    console.error('Failed to load towns:', error);
                    setTowns([]);
                } finally {
                    setIsLoadingTowns(false);
                }
            }
        };
        
        loadTowns();
    }, [open]);

    useEffect(() => {
        if (campaign && !isLoadingTowns) {
            setFormData({
                name: campaign.name || '',
                keywords: Array.isArray(campaign.keywords) 
                    ? campaign.keywords 
                    : (campaign.keywords?.split(',').map(k => k.trim()).filter(Boolean) || []),
                radius: campaign.radius || '',
                bidAmount: campaign.bidAmount || '',
                campaignFund: campaign.campaignFund || '',
                productId: campaign.productId?.toString() || '',
                status: campaign.status ?? true,
                town: campaign.town || ''
            });
            
            if (campaign.campaignFund) {
            }
        } else if (!campaign) {
            setFormData({
                name: '',
                keywords: [],
                radius: '',
                bidAmount: '',
                campaignFund: '',
                productId: '',
                status: true,
                town: ''
            });
        }
    }, [campaign, isLoadingTowns]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'campaignFund') {
            const numValue = parseFloat(value);
            
            setErrors(prev => ({ ...prev, campaignFund: '' }));
            
            if (campaign && campaign.campaignFund) {
            } else if (numValue > currentBalance) {
                setErrors(prev => ({
                    ...prev,
                    campaignFund: `Insufficient balance. Your available balance is ${currentBalance} PLN`
                }));
            }
        }
        
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name?.trim()) {
            newErrors.name = 'Name is required';
        }
        
        if (!Array.isArray(formData.keywords) || formData.keywords.length === 0) {
            newErrors.keywords = 'At least one keyword is required';
        }
        
        if (!formData.productId) {
            newErrors.productId = 'Product selection is required';
        }
        
        const bidAmount = parseFloat(formData.bidAmount);
        if (isNaN(bidAmount) || bidAmount < 0.01) {
            newErrors.bidAmount = 'Bid amount must be at least 0.01 PLN';
        }
        
        const campaignFund = parseFloat(formData.campaignFund);
        if (!formData.campaignFund) {
            newErrors.campaignFund = 'Campaign fund is required';
        } else if (campaignFund <= 0) {
            newErrors.campaignFund = 'Campaign fund must be greater than 0';
        } else if (campaignFund > maxCampaignFund) {
            newErrors.campaignFund = `Campaign fund cannot exceed ${maxCampaignFund} PLN`;
        }
        
        if (!formData.town) {
            newErrors.town = 'Town is required';
        }
        
        const radius = parseFloat(formData.radius);
        if (isNaN(radius) || radius < 1) {
            newErrors.radius = 'Radius must be at least 1 km';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        const campaignData = {
            name: formData.name,
            keywords: formData.keywords,
            radius: parseInt(formData.radius),
            bidAmount: parseFloat(formData.bidAmount),
            campaignFund: parseFloat(formData.campaignFund),
            productId: formData.productId,
            status: formData.status,
            town: formData.town
        };
        
        if (campaign?.id) {
            campaignData.id = campaign.id;
        }
        
        
        try {
            onSubmit(campaignData);
            
            try {
                const newBalance = await userService.getBalance();
                if (typeof setNavbarBalance === 'function') {
                    setNavbarBalance(newBalance.data);
                }
            } catch (error) {
                console.error('Error updating navbar balance:', error);
            }
        } catch (error) {
            console.error('Error submitting campaign:', error);
            setErrors({
                submit: error.message || 'Failed to save campaign. Please try again.'
            });
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="sm" 
            fullWidth
        >
            <DialogTitle>{campaign ? 'Edit Campaign' : 'Create New Campaign'}</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <Alert severity="info">
                            {campaign ? (
                                <>Current campaign fund: {campaign.campaignFund} PLN</>
                            ) : (
                                <>Your current balance: {currentBalance} PLN</>
                            )}
                        </Alert>
                        <TextField
                            name="name"
                            label="Campaign Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            fullWidth
                            error={!!errors.name}
                            helperText={errors.name}
                        />
                        <Autocomplete
                            multiple
                            freeSolo
                            options={suggestedKeywords}
                            value={formData.keywords || []}
                            onChange={(event, newValue) => {
                                setFormData(prev => ({
                                    ...prev,
                                    keywords: newValue ? newValue.filter(keyword => keyword?.trim() !== '') : []
                                }));
                            }}
                            renderTags={(value, getTagProps) =>
                                Array.isArray(value) ? value.map((option, index) => {
                                    const { key, ...chipProps } = getTagProps({ index });
                                    return (
                                        <Chip
                                            key={key}
                                            label={option}
                                            size="small"
                                            {...chipProps}
                                        />
                                    );
                                }) : []
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Keywords"
                                    error={!!errors.keywords}
                                    helperText={errors.keywords || "Type or select keywords"}
                                    required
                                    inputProps={{
                                        ...params.inputProps,
                                        required: Array.isArray(formData.keywords) ? formData.keywords.length === 0 : true
                                    }}
                                />
                            )}
                            sx={{ width: '100%' }}
                        />
                        <TextField
                            name="productId"
                            label="Select Product"
                            select
                            value={formData.productId}
                            onChange={handleChange}
                            required
                            fullWidth
                            error={!!errors.productId}
                            helperText={errors.productId}
                        >
                            {products.map((product) => (
                                <MenuItem key={product.id} value={product.id.toString()}>
                                    {product.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            name="bidAmount"
                            label="Bid Amount (min. 0.01 PLN)"
                            type="number"
                            value={formData.bidAmount}
                            onChange={handleChange}
                            required
                            fullWidth
                            inputProps={{ 
                                min: 0.01, 
                                step: "0.01"
                            }}
                            error={!!errors.bidAmount}
                            helperText={errors.bidAmount || "Minimum bid amount is 0.01"}
                        />
                        <TextField
                            name="campaignFund"
                            label={`Campaign Fund (Max: ${maxCampaignFund} PLN)`}
                            type="number"
                            value={formData.campaignFund}
                            onChange={handleChange}
                            required
                            fullWidth
                            inputProps={{
                                min: 1,
                                max: maxCampaignFund
                            }}
                            error={!!errors.campaignFund}
                            helperText={errors.campaignFund || ''}
                        />
                        <FormControl fullWidth error={!!errors.town}>
                            <InputLabel>Town</InputLabel>
                            <Select
                                name="town"
                                value={formData.town || ''}
                                onChange={(e) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        town: e.target.value
                                    }));
                                }}
                                label="Town"
                                required
                                disabled={isLoadingTowns}
                            >
                                {towns.length > 0 ? (
                                    towns.map((town) => (
                                        <MenuItem 
                                            key={town.value}
                                            value={town.value}
                                        >
                                            {town.label}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem disabled value="">
                                        {isLoadingTowns ? 'Loading towns...' : 'No towns available'}
                                    </MenuItem>
                                )}
                            </Select>
                            {errors.town && <FormHelperText>{errors.town}</FormHelperText>}
                        </FormControl>
                        <TextField
                            name="radius"
                            label="Radius (km)"
                            type="number"
                            value={formData.radius}
                            onChange={handleChange}
                            required
                            fullWidth
                            inputProps={{ min: 1, step: "1" }}
                            error={!!errors.radius}
                            helperText={errors.radius}
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    name="status"
                                    checked={formData.status}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        status: e.target.checked
                                    }))}
                                />
                            }
                            label="Active"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary"
                        disabled={isLoadingTowns}
                    >
                        {campaign ? 'Save Changes' : 'Create Campaign'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AddCampaignDialog; 