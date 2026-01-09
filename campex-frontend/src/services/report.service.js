import api from './api';

export const reportService = {
    createReport: async (reportData) => {
        const response = await api.post('/api/reports', reportData);
        return response.data;
    },
};
