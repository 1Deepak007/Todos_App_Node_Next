import axiosClient from "./axiosClient";

exports.tasksService = {
    // get all tasks created by the user(_id)
    getAllTasks: async () => {
        try {
            const response = await axiosClient.get('/tasks');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getTaskById: async (taskId) => {
        try {
            const response = await axiosClient.get(`/tasks/${taskId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    createTask: async (taskData) => {
        try {
            const response = await axiosClient.post('/tasks', taskData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    updateTask: async (taskId, taskData) => {
        try {
            const response = await axiosClient.patch(`/tasks/${taskId}`, taskData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    deleteTask: async (taskId) => {
        try {
            const response = await axiosClient.delete(`/tasks/${taskId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
}

