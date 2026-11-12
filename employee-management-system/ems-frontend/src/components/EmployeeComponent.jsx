
import React, { useEffect, useState } from 'react'
import {
  createEmployee,
  getEmployee,
  updateEmployee
} from '../services/EmployeeService'
import { listDepartments } from '../services/DepartmentService'
import { useNavigate, useParams } from 'react-router-dom'

const EmployeeComponent = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [department, setDepartment] = useState('')
  const [designation, setDesignation] = useState('')
  const [serverError, setServerError] = useState('')

  const { id } = useParams()
  const navigator = useNavigate()

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    designation: ''
  })
  const [departments, setDepartments] = useState([])

  useEffect(() => {
              listDepartments()
            .then((response) => {
              setDepartments(response.data)
            })
            .catch((error) => {
              console.error('Unable to load departments:', error)
            })
    if (id) {
      getEmployee(id)
        .then((response) => {
          setFirstName(response.data.firstName || '')
          setLastName(response.data.lastName || '')
          setEmail(response.data.email || '')
          setDepartment(response.data.department || '')
          setDesignation(response.data.designation || '')
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }, [id])

  function saveOrUpdateEmployee(e) {
    e.preventDefault()
    setServerError('')

    if (validateForm()) {
      const employee = {
        firstName,
        lastName,
        email,
        department,
        designation
      }

      if (id) {
        updateEmployee(id, employee)
          .then(() => {
            navigator('/employees')
          })
          .catch((error) => {
            if (error.response?.status === 409) {
              setServerError(
                'Email already exists. Please use another email address.'
              )
            } else {
              setServerError('Something went wrong. Please try again.')
              console.error(error)
            }
          })
      } else {
        createEmployee(employee)
          .then(() => {
            navigator('/employees')
          })
          .catch((error) => {
            if (error.response?.status === 409) {
              setServerError(
                'Email already exists. Please use another email address.'
              )
            } else {
              setServerError('Something went wrong. Please try again.')
              console.error(error)
            }
          })
      }
    }
  }

  function validateForm() {
    let valid = true
    const errorsCopy = { ...errors }

    if (firstName.trim()) {
      errorsCopy.firstName = ''
    } else {
      errorsCopy.firstName = 'First name is required'
      valid = false
    }

    if (lastName.trim()) {
      errorsCopy.lastName = ''
    } else {
      errorsCopy.lastName = 'Last name is required'
      valid = false
    }

    if (email.trim()) {
      errorsCopy.email = ''
    } else {
      errorsCopy.email = 'Email is required'
      valid = false
    }

    if (department.trim()) {
      errorsCopy.department = ''
    } else {
      errorsCopy.department = 'Department is required'
      valid = false
    }

    if (designation.trim()) {
      errorsCopy.designation = ''
    } else {
      errorsCopy.designation = 'Designation is required'
      valid = false
    }

    setErrors(errorsCopy)
    return valid
  }

  function pageTitle() {
    return (
      <h2 className="text-center">
        {id ? 'Update Employee' : 'Add Employee'}
      </h2>
    )
  }

  return (
    <div className="container">
      <br />
      <div className="row">
        <div className="card col-md-6 offset-md-3">
          {pageTitle()}

          <div className="card-body">
            <form onSubmit={saveOrUpdateEmployee}>

              {serverError && (
                <div className="alert alert-danger" role="alert">
                  {serverError}
                </div>
              )}

              <div className="form-group mb-2">
                <label className="form-label">First Name:</label>
                <input
                  type="text"
                  placeholder="Enter employee first name"
                  name="firstName"
                  value={firstName}
                  className={`form-control ${
                    errors.firstName ? 'is-invalid' : ''
                  }`}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                {errors.firstName && (
                  <div className="invalid-feedback">
                    {errors.firstName}
                  </div>
                )}
              </div>

              <div className="form-group mb-2">
                <label className="form-label">Last Name:</label>
                <input
                  type="text"
                  placeholder="Enter employee last name"
                  name="lastName"
                  value={lastName}
                  className={`form-control ${
                    errors.lastName ? 'is-invalid' : ''
                  }`}
                  onChange={(e) => setLastName(e.target.value)}
                />
                {errors.lastName && (
                  <div className="invalid-feedback">
                    {errors.lastName}
                  </div>
                )}
              </div>

              <div className="form-group mb-2">
                <label className="form-label">Email:</label>
                <input
                  type="email"
                  placeholder="Enter employee email"
                  name="email"
                  value={email}
                  className={`form-control ${
                    errors.email ? 'is-invalid' : ''
                  }`}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setServerError('')
                  }}
                />
                {errors.email && (
                  <div className="invalid-feedback">
                    {errors.email}
                  </div>
                )}
              </div>

              <div className="form-group mb-2">
                <label className="form-label">Department:</label>
                  <select
                            name="department"
                            value={department}
                            className={`form-select ${
                              errors.department ? 'is-invalid' : ''
                            }`}
                            onChange={(e) => setDepartment(e.target.value)}
                          >
                            <option value="">Select Department</option>

                            {departments.map((department) => (
                              <option
                                key={department.id}
                                value={department.departmentName}
                              >
                                {department.departmentName}
                              </option>
                            ))}
                    </select>
                {errors.department && (
                  <div className="invalid-feedback">
                    {errors.department}
                  </div>
                )}
              </div>

              <div className="form-group mb-3">
                <label className="form-label">Designation:</label>
                <input
                  type="text"
                  placeholder="e.g. Software Developer"
                  name="designation"
                  value={designation}
                  className={`form-control ${
                    errors.designation ? 'is-invalid' : ''
                  }`}
                  onChange={(e) => setDesignation(e.target.value)}
                />
                {errors.designation && (
                  <div className="invalid-feedback">
                    {errors.designation}
                  </div>
                )}
              </div>

              <button className="btn btn-success" type="submit">
                {id ? 'Update Employee' : 'Add Employee'}
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeComponent
