// import axios from 'axios';
// const REST_API_BASE_URL ='http://localhost:8080/api/employees';
// export const listEmployees=() =>   axios.get(REST_API_BASE_URL);
// export const createEmployee =(employee) => axios.post(REST_API_BASE_URL ,employee);
// export const getEmployee=(employeeId) => axios.get(REST_API_BASE_URL + '/' + employeeId);
// export const updateEmployee=(employeeId,employee) => axios.put(REST_API_BASE_URL + '/' + employeeId,employee);
// export const deleteEmployee =(employeeId) => axios.delete(REST_API_BASE_URL +'/' +employeeId);

import axios from 'axios';

const REST_API_BASE_URL = 'http://localhost:8080/api/employees';

const api = axios.create({
    baseURL: REST_API_BASE_URL,
    withCredentials: true
});

export const listEmployees = () =>
    api.get('');

export const createEmployee = (employee) =>
    api.post('', employee);

export const getEmployee = (employeeId) =>
    api.get('/' + employeeId);

export const updateEmployee = (employeeId, employee) =>
    api.put('/' + employeeId, employee);

export const deleteEmployee = (employeeId) =>
    api.delete('/' + employeeId);





// import axios from 'axios';

// const REST_API_BASE_URL = 'http://localhost:8080/api/employees';

// export const listEmployees = () =>
//     axios.get(REST_API_BASE_URL);

// export const createEmployee = (employee) =>
//     axios.post(REST_API_BASE_URL, employee);

// export const getEmployee = (employeeId) =>
//     axios.get(REST_API_BASE_URL + '/' + employeeId);

// export const updateEmployee = (employeeId, employee) =>
//     axios.put(REST_API_BASE_URL + '/' + employeeId, employee);

// export const deleteEmployee = (employeeId) =>
//     axios.delete(REST_API_BASE_URL + '/' + employeeId);