import api from './api';

export const productService = {
  // Get all products with filters and pagination
  getProducts: async (filters = {}, page = 0, size = 20) => {
    const { data } = await api.get('/api/products', {
      params: {
        page,
        size,
        ...filters,
      },
    });
    return data;
  },

  // Get single product by ID
  getProductById: async (id) => {
    const { data } = await api.get(`/api/products/${id}`);
    // Backend returns ApiResponse wrapper, extract the actual data
    return data?.data || data;
  },

  // Create new product
  createProduct: async (productData) => {
    const { data } = await api.post('/api/products', productData);
    // Backend returns ApiResponse wrapper, extract the actual data
    return data?.data || data;
  },

  // Update product
  updateProduct: async (id, productData) => {
    const { data } = await api.put(`/api/products/${id}`, productData);
    // Backend returns ApiResponse wrapper, extract the actual data
    return data?.data || data;
  },

  // Delete product
  deleteProduct: async (id) => {
    await api.delete(`/api/products/${id}`);
  },

  // Update product status
  updateProductStatus: async (id, status) => {
    const { data } = await api.patch(`/api/products/${id}/status`, { status });
    return data;
  },

  // Mark product as sold
  markAsSold: async (id) => {
    const { data } = await api.patch(`/api/products/${id}/mark-sold`);
    return data?.data || data;
  },

  // Mark product as active (revert from sold)
  markAsActive: async (id) => {
    const { data } = await api.patch(`/api/products/${id}/mark-active`);
    return data?.data || data;
  },

  // Search products
  searchProducts: async (query, page = 0, size = 20) => {
    const { data } = await api.get('/api/products/search', {
      params: { query, page, size },
    });
    return data;
  },
};