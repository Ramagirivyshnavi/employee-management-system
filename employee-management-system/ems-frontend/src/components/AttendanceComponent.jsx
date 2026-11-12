
import React, { useEffect, useState, useRef } from 'react';
import {
    listAttendance,
    createAttendance,
    updateAttendance,
    deleteAttendance
} from '../services/AttendanceService';
import { listEmployees } from '../services/EmployeeService';

const AttendanceComponent = () => {
    const [attendanceList, setAttendanceList] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [employeeSearch, setEmployeeSearch] = useState('');
    const [employeeDropdownOpen, setEmployeeDropdownOpen] = useState(false);
    const employeeDropdownRef = useRef(null);

    const [formData, setFormData] = useState({
        employeeId: '',
        attendanceDate: '',
        checkIn: '',
        checkOut: '',
        status: 'Present'
    });

    useEffect(() => {
        loadEmployees();
        loadAttendance();
    }, []);

    const loadEmployees = async () => {
        try {
            const response = await listEmployees();
            setEmployees(response.data);
        } catch (err) {
            setError('Unable to load employees. Please check the backend.');
        }
    };

    const loadAttendance = async () => {
        try {
            const response = await listAttendance();
            setAttendanceList(response.data);
        } catch (err) {
            setError('Unable to load attendance records.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const resetForm = () => {
        setFormData({
            employeeId: '',
            attendanceDate: '',
            checkIn: '',
            checkOut: '',
            status: 'Present'
        });

        setEmployeeSearch('');
        setEmployeeDropdownOpen(false);
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setSuccess('');

        if (!formData.employeeId || !formData.attendanceDate) {
            setError('Please select an employee and attendance date.');
            return;
        }

        if (
            formData.status === 'Present' &&
            !formData.checkIn
        ) {
            setError('Please enter the check-in time for Present status.');
            return;
        }

        if (
            formData.checkIn &&
            formData.checkOut &&
            formData.checkOut < formData.checkIn
        ) {
            setError('Check-out time cannot be earlier than check-in time.');
            return;
        }

        const attendanceData = {
            employeeId: Number(formData.employeeId),
            attendanceDate: formData.attendanceDate,
            checkIn: formData.status === 'Present'
                ? (formData.checkIn || null)
                : null,
            checkOut: formData.status === 'Present'
                ? (formData.checkOut || null)
                : null,
            status: formData.status
        };

        try {
            if (editingId !== null) {
                await updateAttendance(editingId, attendanceData);
                setSuccess('Attendance updated successfully!');
            } else {
                await createAttendance(attendanceData);
                setSuccess('Attendance recorded successfully!');
            }

            resetForm();
            await loadAttendance();

        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to save attendance. Check for duplicate records or backend errors.'
            );
        }
    };

    const getEmployeeName = (employeeId) => {
        const employee = employees.find(
            (emp) => Number(emp.id) === Number(employeeId)
        );

        return employee
            ? `${employee.firstName} ${employee.lastName}`
            : `Employee #${employeeId}`;
    };

    const filteredEmployees = employees.filter((employee) => {
        const fullName = `${employee.firstName} ${employee.lastName}`;

        return fullName
            .toLowerCase()
            .includes(employeeSearch.trim().toLowerCase());
    });

    const selectEmployee = (employee) => {
        setFormData((previous) => ({
            ...previous,
            employeeId: String(employee.id)
        }));

        setEmployeeSearch(
            `${employee.firstName} ${employee.lastName}`
        );

        setEmployeeDropdownOpen(false);
    };

    const handleEmployeeBlur = (event) => {
        if (
            employeeDropdownRef.current &&
            !employeeDropdownRef.current.contains(event.relatedTarget)
        ) {
            setEmployeeDropdownOpen(false);
        }
    };

    const handleEdit = (record) => {
        setFormData({
            employeeId: String(record.employeeId),
            attendanceDate: record.attendanceDate,
            checkIn: record.checkIn || '',
            checkOut: record.checkOut || '',
            status: record.status
        });

        setEmployeeSearch(getEmployeeName(record.employeeId));
        setEmployeeDropdownOpen(false);
        setEditingId(record.id);
        setError('');
        setSuccess('');

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this attendance record?'
        );

        if (!confirmed) return;

        setError('');
        setSuccess('');

        try {
            await deleteAttendance(id);
            setSuccess('Attendance record deleted successfully!');
            await loadAttendance();

            if (editingId === id) {
                resetForm();
            }
        } catch (err) {
            setError('Unable to delete attendance record.');
        }
    };

    return (
        <div className="container py-4">

            <div className="mb-4">
                <h2 className="fw-bold">Attendance Management</h2>
                <p className="text-muted">
                    Record and manage daily employee attendance.
                </p>
            </div>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {success && (
                <div className="alert alert-success">
                    {success}
                </div>
            )}

            <div className="card shadow-sm border-0 mb-4">
        
                    <div className="card-header text-white py-3 attendance-header">
                    <h5 className="mb-0">
                        {editingId !== null
                            ? 'Update Attendance'
                            : 'Record Attendance'}
                    </h5>
                </div>

                <div className="card-body p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">

                            {/* Searchable employee dropdown */}
                            <div
                                className="col-md-6"
                                ref={employeeDropdownRef}
                            >
                                <label className="form-label">
                                    Employee *
                                </label>

                                <div className="position-relative">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search and select employee..."
                                        value={
                                            employeeDropdownOpen
                                                ? employeeSearch
                                                : formData.employeeId
                                                    ? getEmployeeName(
                                                        Number(formData.employeeId)
                                                    )
                                                    : ''
                                        }
                                        onFocus={() => {
                                            setEmployeeSearch(
                                                formData.employeeId
                                                    ? getEmployeeName(
                                                        Number(formData.employeeId)
                                                    )
                                                    : ''
                                            );
                                            setEmployeeDropdownOpen(true);
                                        }}
                                        onChange={(e) => {
                                            setEmployeeSearch(e.target.value);
                                            setEmployeeDropdownOpen(true);

                                            setFormData((previous) => ({
                                                ...previous,
                                                employeeId: ''
                                            }));
                                        }}
                                        onBlur={handleEmployeeBlur}
                                        autoComplete="off"
                                        required={!formData.employeeId}
                                    />

                                    {employeeDropdownOpen && (
                                        <div
                                            className="position-absolute bg-white border rounded shadow-sm w-100"
                                            style={{
                                                top: '100%',
                                                left: 0,
                                                zIndex: 1050,
                                                maxHeight: '220px',
                                                overflowY: 'auto'
                                            }}
                                        >
                                            {filteredEmployees.length > 0 ? (
                                                filteredEmployees.map((employee) => (
                                                    <button
                                                        key={employee.id}
                                                        type="button"
                                                        className="dropdown-item py-2"
                                                        onMouseDown={(e) =>
                                                            e.preventDefault()
                                                        }
                                                        onClick={() =>
                                                            selectEmployee(employee)
                                                        }
                                                    >
                                                        {employee.firstName}{' '}
                                                        {employee.lastName}
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="px-3 py-2 text-muted">
                                                    No employees found
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">
                                    Attendance Date *
                                </label>

                                <input
                                    type="date"
                                    className="form-control"
                                    name="attendanceDate"
                                    value={formData.attendanceDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label">
                                    Check-in Time
                                </label>

                                <input
                                    type="time"
                                    className="form-control"
                                    name="checkIn"
                                    value={formData.checkIn}
                                    onChange={handleChange}
                                    disabled={formData.status === 'Absent'}
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label">
                                    Check-out Time
                                </label>

                                <input
                                    type="time"
                                    className="form-control"
                                    name="checkOut"
                                    value={formData.checkOut}
                                    onChange={handleChange}
                                    disabled={formData.status === 'Absent'}
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label">
                                    Status *
                                </label>

                                <select
                                    className="form-select"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Present">Present</option>
                                    <option value="Absent">Absent</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-4 d-flex gap-2">
                            <button
                                type="submit"
                                className="btn attendance-btn"
                            >
                                {editingId !== null
                                    ? 'Update Attendance'
                                    : 'Save Attendance'}
                            </button>

                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={resetForm}
                            >
                                Clear
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="card shadow-sm border-0">
                <div className="card-header bg-white py-3">
                    <h5 className="mb-0">Attendance Records</h5>
                </div>

                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Employee</th>
                                    <th>Date</th>
                                    <th>Check-in</th>
                                    <th>Check-out</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {attendanceList.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="text-center py-4"
                                        >
                                            No attendance records found.
                                        </td>
                                    </tr>
                                ) : (
                                    attendanceList.map((record) => (
                                        <tr key={record.id}>
                                            <td>{record.id}</td>

                                            <td>
                                                {getEmployeeName(
                                                    record.employeeId
                                                )}
                                            </td>

                                            <td>{record.attendanceDate}</td>
                                            <td>{record.checkIn || '--'}</td>
                                            <td>{record.checkOut || '--'}</td>

                                            <td>
                                                <span
                                                    className={`badge ${
                                                        record.status === 'Present'
                                                            ? 'bg-success'
                                                            : 'bg-danger'
                                                    }`}
                                                >
                                                    {record.status}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="d-flex gap-2">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() =>
                                                            handleEdit(record)
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() =>
                                                            handleDelete(record.id)
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AttendanceComponent;
