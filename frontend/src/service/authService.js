import http from './http-common';

const login = (loginData) => {
    return http.post('/api/auth/login', loginData)
}

const register = (registerData) => {
    return http.post('/api/auth/register', registerData)
}

const authService = {
    login,
    register
}

export default authService