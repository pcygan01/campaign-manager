import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box
} from '@mui/material';

const AddProductDialog = ({ open, onClose, onSubmit, product }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: ''
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price ? product.price.toString() : ''
            });
        } else {
            setFormData({
                name: '',
                description: '',
                price: ''
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const productData = {
            ...formData,
            price: parseFloat(formData.price)
        };
        
        if (product && product.id) {
            productData.id = product.id;
        }
        
        onSubmit(productData);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{product ? 'Edit Product' : 'Create Product'}</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            name="name"
                            label="Product Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                        <TextField
                            name="description"
                            label="Description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            multiline
                            rows={3}
                            fullWidth
                        />
                        <TextField
                            name="price"
                            label="Price (PLN)"
                            type="number"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            fullWidth
                            inputProps={{
                                min: "0.01",
                                step: "0.01"
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained" color="primary">
                        {product ? 'Save Changes' : 'Create Product'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AddProductDialog; 