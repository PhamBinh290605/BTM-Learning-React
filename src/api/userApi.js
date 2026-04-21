import axiosClient from "./axiosClient";

const userApi = {
    getMyProfile: () => {
        return axiosClient.get('/users/my-info');
    },
    updateProfile: (data) => {
        return axiosClient.put('/users/profile', data);
    },
    changePassword: (data) => {
        return axiosClient.patch('/users/change-password', data);
    },

    uploadAvatar: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return axiosClient.post(`/users/avatar`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    registerAsInstructor: () => {
        return axiosClient.post('/users/register-instructor');
    },

    getUsers: (params = {}) => {
        return axiosClient.get('/users', { params });
    },

    toggleActive: (userId) => {
        return axiosClient.patch(`/users/${userId}/toggle-active`);
    },

    changeRole: (userId, role) => {
        return axiosClient.patch(`/users/${userId}/role`, { role });
    },
};

export default userApi;