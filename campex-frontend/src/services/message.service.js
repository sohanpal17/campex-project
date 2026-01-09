import api from './api';

export const messageService = {
    // Get or create conversation with a seller
    getOrCreateConversation: async (sellerId, productId = null) => {
        const params = new URLSearchParams({ sellerId: sellerId.toString() });
        if (productId) {
            params.append('productId', productId.toString());
        }
        const { data } = await api.post(`/api/messages/conversations/get-or-create?${params}`);
        return data?.data || data;
    },

    // Get all conversations
    getConversations: async () => {
        const { data } = await api.get('/api/messages/conversations');
        return data;
    },

    // Get messages for a conversation
    getMessages: async (conversationId, page = 0, size = 50) => {
        const { data } = await api.get(`/api/messages/conversations/${conversationId}`, {
            params: { page, size },
        });
        return data;
    },

    // Send a message
    sendMessage: async (messageData) => {
        const { data } = await api.post('/api/messages', messageData);
        return data;
    },

    // Delete a conversation
    deleteConversation: async (conversationId) => {
        const { data } = await api.delete(`/api/messages/conversations/${conversationId}`);
        return data;
    },
};
