import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api`;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 403 || error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authService = {
    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', {
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                password: userData.password
            });
            return { success: true, data: response.data };
        } catch (error) {
            if (error.response?.status === 400 && 
                error.response?.data === 'Email already registered') {
                return { 
                    success: false, 
                    emailExists: true 
                };
            }
            throw error;
        }
    },
    
    login: async (credentials) => {
        const response = await api.post('/auth/login', {
            email: credentials.email,
            password: credentials.password
        });
        return response;
    },
    logout: () => {
        localStorage.removeItem('token');
    }
};

export const productService = {
    getSellerProducts: () => api.get('/products/seller'),
    createProduct: (productData) => api.post('/products', productData),
    updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
    deleteProduct: (id) => api.delete(`/products/${id}`)
};

export const campaignService = {
    getSellerCampaigns: () => api.get('/campaigns/seller'),
    createCampaign: async (campaignData) => {
        try {
            const response = await api.post('/campaigns', campaignData);
            return response;
        } catch (error) {
            console.error('Error creating campaign:', error);
            throw error;
        }
    },
    updateCampaign: async (id, campaignData) => {
        try {
            const response = await api.put(`/campaigns/${id}`, campaignData);
            return response;
        } catch (error) {
            console.error('Error updating campaign:', error);
            console.error('Server response:', error.response?.data);
            throw error;
        }
    },
    deleteCampaign: (id) => api.delete(`/campaigns/${id}`)
};

export const userService = {
    getBalance: () => api.get('/users/balance'),
    addBalance: (amount) => api.post(`/users/balance/add?amount=${amount}`),
    getStats: async () => {
        try {
            const balanceResponse = await api.get('/users/balance');
            
            const productsResponse = await api.get('/products');
            const totalProducts = productsResponse.data.length;
            
            const campaignsResponse = await api.get('/campaigns');
            const totalCampaigns = campaignsResponse.data.length;
            
            return {
                balance: balanceResponse.data,
                totalProducts: totalProducts,
                totalCampaigns: totalCampaigns
            };
        } catch (error) {
            console.error('Error fetching stats:', error);
            throw error;
        }
    }
};

export const townService = {
    getAllTowns: () => api.get('/towns')
};

const apiServices = {
    productService,
    campaignService,
    userService,
    authService
};

export default apiServices;