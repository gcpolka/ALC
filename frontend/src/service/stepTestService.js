import http from './http-common'

const createStepTest = async (stepTestData) => {
    return await http.post('/api/step-test/', stepTestData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

const getStepTestInfo = async () => {
    return await http.get('/api/step-test/info')
}

const listStepTest = async () => {
    return await http.get('/api/step-test')
}

const stepTestById = async (id) => {
    return await http.get(`/api/step-test/${id}`)
}

const updateStepTest = async (id, stepTestData) => {
    return await http.put(`/api/step-test/${id}`, stepTestData, {
        headers: {
            'Content-Type': 'multipart/form-data', // Ensure the content type is set for file uploads
        },
    })
}

const deleteStepTest = async (id) => {
    return await http.delete(`/api/step-test/${id}`)
}

const stepTesstService = {
    createStepTest,
    getStepTestInfo,
    listStepTest,
    stepTestById,
    updateStepTest,
    deleteStepTest
}

export default stepTesstService