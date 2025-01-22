import http from './http-common'

const createPipe = async (pipeData) => {
    return await http.post('/api/pipe/', pipeData)
}

const listPipe = async () => {
    return await http.get('/api/pipe/')
}

const pipeById = async (id) => {
    return await http.get(`/api/pipe/${id}`).then((res) => {
        return res
    })
}

const updatePipe = async (id, pipeData) => {
    return await http.put(`/api/pipe/${id}`, pipeData)
}

const deletePipe = async (id) => {
    return await http.delete(`/api/pipe/${id}`)
}

const pipeService = {
    createPipe,
    listPipe,
    pipeById,
    updatePipe,
    deletePipe
}

export default pipeService