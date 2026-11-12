
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
// import { FaUsers, FaBuilding } from 'react-icons/fa'
import 'bootstrap-icons/font/bootstrap-icons.css';

const HomeComponent = () => {
    const [employeeCount, setEmployeeCount] = useState(null);
    const [departmentCount, setDepartmentCount] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8080/api/employees', {
            withCredentials: true
        })
            .then((response) => {
                setEmployeeCount(response.data.length);
            })
            .catch((error) => {
                console.error('Unable to load employees:', error);
            });

        axios.get('http://localhost:8080/api/departments', {
            withCredentials: true
        })
            .then((response) => {
                setDepartmentCount(response.data.length);
            })
            .catch((error) => {
                console.error('Unable to load departments:', error);
            });
    }, []);

    return (
        <div className="container py-4">

            {/* Welcome section */}
            <div
                className="p-4 p-md-5 mb-4 rounded-4 text-white"
                style={{
                    background: 'linear-gradient(120deg, #123B70, #2878C8)'
                }}
            >
                <h1 className="fw-bold">Welcome to EMS</h1>
                <p className="mb-0">
                    Manage your employees, departments and workforce
                    from one place.
                </p>
            </div>

            {/* Overview cards */}
            <div className="row g-4 mb-5">

                {/* Employee count */}
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm h-100 home-action-card">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted mb-2">
                                        Total Employees
                                    </p>
                                    <h2 className="fw-bold mb-0">
                                        {employeeCount === null ? '—' : employeeCount}
                                    </h2>
                                </div>

                               <div
                                        className="rounded-3 text-white d-flex align-items-center justify-content-center"
                                        style={{
                                            backgroundColor: '#4682B4',
                                            width: '44px',
                                            height: '44px'
                                        }}
                                    >
                                        <i className="bi bi-people-fill" style={{ fontSize: '20px' }}></i>
                                    </div>
                            </div>

                            <Link to="/employees" className="btn attendance-btn mt-3">
                                View Employees
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Department count */}
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm h-100 home-action-card">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted mb-2">
                                        Total Departments
                                    </p>
                                    <h2 className="fw-bold mb-0">
                                        {departmentCount === null ? '—' : departmentCount}
                                    </h2>
                                </div>

                               <div
                                        className="rounded-3 text-white d-flex align-items-center justify-content-center"
                                        style={{
                                            backgroundColor: '#4682B4',
                                            width: '44px',
                                            height: '44px'
                                        }}
                                    >
                                    <i className="bi bi-building fs-5" style={{ fontSize: '20px' }}></i>
                                </div>
                            </div>

                            <Link to="/departments" className="btn attendance-btn mt-3">
                                View Departments
                            </Link>
                        </div>
                    </div>
                </div>

            </div>

            {/* Quick actions */}
            <h3 className="fw-bold mb-3">Quick Actions</h3>

            <div className="row g-3 mb-5">

                <div className="col-md-4">
                    <Link to="/add-employee" className="text-decoration-none">
                        <div className="card border-0 shadow-sm h-100 home-action-card">
                            <div className="card-body p-4">
                                <i className="bi bi-person-plus fs-2 text-primary"></i>
                                <h5 className="mt-3 text-dark">Add Employee</h5>
                                <p className="text-muted mb-0">
                                    Register a new employee in the system.
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="col-md-4">
                    <Link to="/employees" className="text-decoration-none">
                        <div className="card border-0 shadow-sm h-100 home-action-card">
                            <div className="card-body p-4">
                                <i className="bi bi-people fs-2 text-primary"></i>
                                <h5 className="mt-3 text-dark">Manage Employees</h5>
                                <p className="text-muted mb-0">
                                    View, update and manage employee records.
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="col-md-4">
                    <Link to="/manage-departments" className="text-decoration-none">
                        <div className="card border-0 shadow-sm h-100 home-action-card">
                            <div className="card-body p-4">
                                <i className="bi bi-building fs-2 text-primary"></i>
                                <h5 className="mt-3 text-dark">Manage Departments</h5>
                                <p className="text-muted mb-0">
                                    Add and manage company departments.
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>

            </div>

            {/* Attendance management */}
            <div className="row">
                <div className="col-md-4 mb-4">
                    <div className="card shadow-sm h-100 home-action-card">
                        <div className="card-body">
                            <h5 className="card-title">
                                Attendance Management
                            </h5>

                            <p className="card-text text-muted">
                                Record and manage daily employee attendance.
                            </p>

                            <Link to="/attendance" className="btn attendance-btn">
                                Manage Attendance
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default HomeComponent;

