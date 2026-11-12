
import axios from 'axios';

const REST_API_BASE_URL = 'http://localhost:8080/api/departments';

const departmentApi = axios.create({
    baseURL: REST_API_BASE_URL,
    withCredentials: true
});

export const listDepartments = () =>
    departmentApi.get('');

export const createDepartment = (department) =>
    departmentApi.post('', department);

export const getDepartment = (departmentId) =>
    departmentApi.get('/' + departmentId);

export const updateDepartment = (departmentId, department) =>
    departmentApi.put('/' + departmentId, department);

export const deleteDepartment = (departmentId) =>
    departmentApi.delete('/' + departmentId);
