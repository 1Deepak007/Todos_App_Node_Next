import axiosClient from "./axiosClient";

const profileService = {
    getProfile: async () => {
        try {
            const response = await axiosClient.get('/profile/');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message || 'Failed to fetch profile.';
        }
    },

    updateProfile: async (data, isMultipart = false) => {
        try {
            const config = isMultipart ? { headers: { 'Content-Type': 'multipart/form-data' }} : {};
            const response = await axiosClient.patch('/profile/update', data, config);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message || 'Failed to update profile.';
        }
    },

    updatePassword: async (passwordData) => { // Expects { currentPassword, newPassword, passwordConfirm }
        // console.log('Updating password with data:', passwordData);
        try {
            const response = await axiosClient.patch('/profile/update', passwordData);
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

export default profileService;