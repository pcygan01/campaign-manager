import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Box } from '@mui/material';

const ProductCard = ({ product, onDelete, onEdit }) => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {product.description}
                </Typography>
                <Box mt={2}>
                    <Typography variant="h6" color="primary">
                        {product.price.toFixed(2)} PLN
                    </Typography>
                </Box>
            </CardContent>
            <CardActions>
                <Button 
                    size="small" 
                    color="primary" 
                    onClick={() => onEdit(product)}
                >
                    Edit
                </Button>
                <Button 
                    size="small" 
                    color="error" 
                    onClick={() => onDelete(product.id)}
                >
                    Delete
                </Button>
            </CardActions>
        </Card>
    );
};

export default ProductCard; 