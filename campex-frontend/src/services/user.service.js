import api from './api';

export const userService = {
  // Get current user profile
  getMyProfile: async () => {
    const { data } = await api.get('/api/users/me');
    // Backend returns ApiResponse wrapper, extract the actual data
    return data?.data || data;
  },

  // Update profile
  updateProfile: async (profileData) => {
    const { data } = await api.put('/api/users/me', profileData);
    return data;
  },

  // Get user's listings
  getMyListings: async (status = null) => {
    const { data } = await api.get('/api/users/me/listings', {
      params: { status },
    });
    return data;
  },

  // Get saved items
  getSavedItems: async () => {
    const { data } = await api.get('/api/users/saved-items');
    return data;
  },

  // Save item
  saveItem: async (productId) => {
    const { data } = await api.post('/api/users/saved-items', productId);
    return data;
  },

  // Unsave item
  unsaveItem: async (productId) => {
    await api.delete(`/api/users/saved-items/${productId}`);
  },

  // Get other user's listings
  getUserListings: async (userId) => {
    const { data } = await api.get(`/api/users/${userId}/listings`);
    return data;
  },

  // Block user
  blockUser: async (userId) => {
    await api.post(`/api/users/block/${userId}`);
  },

  // Unblock user
  unblockUser: async (userId) => {
    await api.delete(`/api/users/block/${userId}`);
  },

  // Get blocked users
  getBlockedUsers: async () => {
    const { data } = await api.get('/api/users/blocked');
    return data;
  },

  // Delete account
  deleteAccount: async () => {
    await api.delete('/api/users/me');
  },
};