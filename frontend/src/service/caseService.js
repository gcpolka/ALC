import http from './http-common';

// Create a case (with file upload support)
const createCase = async (caseData) => {
    return await http.post('/api/case/', caseData, {
        headers: {
            'Content-Type': 'multipart/form-data', // Ensure the content type is set for file uploads
        },
    });
};

const searchPendingApproval = async () => {
    return await http.get(`/api/case/search/status?status=รอการอนุมัติ`);
}

const searchApproval = async () => {
    return await http.get(`/api/case/search/status?status=อนุมัติ`);
}

const getCaseInfo = async () => {
    return await http.get('/api/case/info');
}

// Get a list of cases
const listCase = async () => {
    return await http.get('/api/case/');
};

// Get a case by its ID
const caseById = async (id) => {
    return await http.get(`/api/case/${id}`)
};

// Update a case (with file upload support if necessary)
const updateCase = async (id, caseData) => {
    return await http.put(`/api/case/${id}`, caseData, {
        headers: {
            'Content-Type': 'multipart/form-data', // Ensure the content type is set for file uploads
        },
    });
};

// Delete a case by its ID
const deleteCase = async (id) => {
    return await http.delete(`/api/case/${id}`);
};

const caseService = {
    createCase,
    searchPendingApproval,
    searchApproval,
    getCaseInfo,
    listCase,
    caseById,
    updateCase,
    deleteCase
};

export default caseService;
