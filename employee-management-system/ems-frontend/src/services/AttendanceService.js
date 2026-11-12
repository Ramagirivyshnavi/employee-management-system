
import axios from 'axios';

const attendanceApi = axios.create({
    baseURL: 'http://localhost:8080/api/attendance',
    withCredentials: true
});

export const listAttendance = () =>
    attendanceApi.get('');

export const getAttendance = (attendanceId) =>
    attendanceApi.get('/' + attendanceId);

export const createAttendance = (attendance) =>
    attendanceApi.post('', attendance);

export const updateAttendance = (attendanceId, attendance) =>
    attendanceApi.put('/' + attendanceId, attendance);

export const deleteAttendance = (attendanceId) =>
    attendanceApi.delete('/' + attendanceId);

