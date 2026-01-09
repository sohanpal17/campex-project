import api from './api';

export const itemRequestService = {
    // Create a new item request
    createRequest: async (data) => {
        const response = await api.post('/api/item-requests', data);
        return response.data.data;
    },

    // Get all open requests with pagination
    getRequests: async (page = 0, size = 20) => {
        const response = await api.get('/api/item-requests', {
            params: { page, size }
        });
        return response.data;
    },

    // Get current user's requests
    getMyRequests: async (page = 0, size = 20) => {
        const response = await api.get('/api/item-requests/my', {
            params: { page, size }
        });
        return response.data;
    },

    // Update request status
    updateStatus: async (id, status) => {
        const response = await api.patch(`/api/item-requests/${id}/status`, null, {
            params: { status }
        });
        return response.data.data;
    },

    // Delete a request
    deleteRequest: async (id) => {
        const response = await api.delete(`/api/item-requests/${id}`);
        return response.data;
    },
};
