import api from './api';

export const campaignService = {
    // Get active campaigns
    getActiveCampaigns: async () => {
        const { data } = await api.get('/api/campaigns/active');
        return data;
    },

    // Check if user is interested in a campaign
    isInterested: async (campaignId) => {
        const { data } = await api.get(`/api/campaigns/${campaignId}/interested`);
        return data?.data || false;
    },

    // Mark interest in a campaign
    markInterest: async (campaignId) => {
        const { data } = await api.post(`/api/campaigns/${campaignId}/interest`);
        return data;
    },

    // Unmark interest in a campaign
    unmarkInterest: async (campaignId) => {
        await api.delete(`/api/campaigns/${campaignId}/interest`);
    },
};
