import axiosClient from "./axiosClient";

export default profileService = {
    getProfile: async () => {
        try {
            const response = await axiosClient.get('/profile/');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message || 'Failed to fetch profile.';
        }
    },

    updateProfile: async (data) => {
        try {
            const response = await axiosClient.patch('/profile/update', data);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message || 'Failed to update profile.';
        }
    },

    updatePassword: async (passwordData) => { // Expects { currentPassword, newPassword, passwordConfirm }
        try {
            const response = await axiosClient.patch('/users/updateMyPassword', passwordData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message || 'Failed to change password.';
        }
    },

    deleteProfile: async () => {
        try {
            const response = await axiosClient.delete('/profile/delete');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message || 'Failed to delete profile.';
        }
    }
}