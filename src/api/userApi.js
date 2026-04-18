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
    }
};

export default userApi;