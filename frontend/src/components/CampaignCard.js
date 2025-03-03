import React from 'react';
import { Card, CardContent, Typography, Button, Chip, Box, Stack, Divider } from '@mui/material';
import { LocationOn, AttachMoney, LocalOffer, Inventory2 } from '@mui/icons-material';

const CampaignCard = ({ campaign, products, onDelete, onEdit }) => {
    const product = products.find(p => p.id === campaign.productId) || { name: 'Unknown' };

    return (
        <Card 
            elevation={2}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                }
            }}
        >
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                        {campaign.name}
                    </Typography>
                    <Chip
                        label={campaign.status ? 'ACTIVE' : 'INACTIVE'}
                        color={campaign.status ? 'success' : 'error'}
                        size="small"
                        sx={{ ml: 1 }}
                    />
                </Box>

                <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Inventory2 sx={{ color: 'primary.main', fontSize: 20 }} />
                        <Typography variant="body2" color="text.secondary">
                            Product: {product.name}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AttachMoney sx={{ color: 'primary.main', fontSize: 20 }} />
                        <Typography variant="body2" color="text.secondary">
                            Bid Amount: {campaign.bidAmount} PLN
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOn sx={{ color: 'primary.main', fontSize: 20 }} />
                        <Typography variant="body2" color="text.secondary">
                            {campaign.town ? (
                                campaign.town.charAt(0) + campaign.town.slice(1).toLowerCase()
                            ) : 'No location'} ({campaign.radius} km)
                        </Typography>
                    </Box>

                    {campaign.keywords && campaign.keywords.length > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                            <LocalOffer sx={{ color: 'primary.main', fontSize: 20 }} />
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {campaign.keywords.map((keyword, index) => (
                                    <Chip
                                        key={index}
                                        label={keyword}
                                        size="small"
                                        variant="outlined"
                                        sx={{ 
                                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                            fontSize: '0.75rem'
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Button 
                        size="small" 
                        onClick={() => onEdit(campaign)}
                        variant="outlined"
                        sx={{ minWidth: '80px' }}
                    >
                        EDIT
                    </Button>
                    <Button 
                        size="small" 
                        color="error" 
                        onClick={() => onDelete(campaign.id)}
                        variant="outlined"
                        sx={{ minWidth: '80px' }}
                    >
                        DELETE
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default CampaignCard; 