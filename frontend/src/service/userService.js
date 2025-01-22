import http from './http-common';

const userInfo = () => {
    const token = localStorage.getItem("token");
    if (token) {
        http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    return http.get("/api/user/info");
};

const userById = async (id) => {
    return http.get(`/api/user/info/${id}`).then((res) => {
        return res;
    });
}

const userAll = () => {
    return http.get('/api/user/all')
}

const updateUser = async (id, updateUser) => {
    return http.put(`http://localhost:8080/api/user/update/${id}`, updateUser)
}

const updateProfile = async (updateProfile) => {
    return http.put(`http://localhost:8080/api/user/profile`, updateProfile)
}

const deleteUser = async (id) => {
    return http.delete(`/api/user/delete/${id.toString()}`)
}

const userService = {
    userInfo,
    userAll,
    deleteUser,
    userById,
    updateProfile,
    updateUser
}

export default userService;
