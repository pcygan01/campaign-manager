import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { productService } from '../services/api';
import ProductCard from '../components/ProductCard';
import AddProductDialog from '../components/AddProductDialog';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getSellerProducts();
      setProducts(response.data);
      setError(null);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (productData) => {
    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, productData);
        showAlert('Product updated successfully', 'success');
      } else {
        await productService.createProduct(productData);
        showAlert('Product created successfully', 'success');
      }
      await loadProducts();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving product:', error);
      showAlert(error.response?.data?.message || 'Failed to save product', 'error');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      await productService.deleteProduct(id);
      showAlert('Product deleted successfully', 'success');
      loadProducts();
    } catch (error) {
      showAlert('Failed to delete product', 'error');
    }
  };

  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">Products</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => setOpenDialog(true)}
        >
          Add New Product
        </Button>
      </Box>

      {products.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" gutterBottom>
            No products found
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => setOpenDialog(true)}
          >
            Add Your First Product
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {products.map(product => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <ProductCard 
                product={product} 
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <AddProductDialog 
        open={openDialog}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        product={editingProduct}
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
    </Container>
  );
} 