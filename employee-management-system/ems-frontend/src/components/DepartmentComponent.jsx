
import React, { useEffect, useState } from 'react'
import {
  listDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment
} from '../services/DepartmentService'

  const DepartmentComponent = ({ manage = false }) => {

  const [departments, setDepartments] = useState([])
  const [departmentName, setDepartmentName] = useState('')
  const [description, setDescription] = useState('')
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDepartments()
  }, [])

  async function loadDepartments() {
    setError('');

    try {
        const response = await listDepartments();

        console.log('Departments API response:', response.data);

        if (Array.isArray(response.data)) {
            setDepartments(response.data);
        } else {
            console.error('Unexpected departments response:', response.data);
            setDepartments([]);
            setError('Unexpected response from the departments API');
        }
    } catch (error) {
        console.error(
            'Unable to load departments:',
            error.response?.status,
            error.response?.data || error.message
        );

        setError(
            error.response?.status === 403
                ? 'Access denied. Please log in again.'
                : 'Unable to load departments. Please check the backend.'
        );
    }
}

  function saveDepartment(e) {
    e.preventDefault()
    setError('')

    if (!departmentName.trim()) {
      setError('Department name is required')
      return
    }

    const department = {
      departmentName: departmentName.trim(),
      description: description.trim()
    }

    const request = editId
      ? updateDepartment(editId, department)
      : createDepartment(department)

    request
      .then(() => {
        setDepartmentName('')
        setDescription('')
        setEditId(null)
        loadDepartments()
      })
      .catch((error) => {
        if (error.response?.status === 409) {
          setError('Department already exists')
        } else {
          setError('Something went wrong. Please try again.')
          console.error(error)
        }
      })
  }

  function editDepartment(department) {
    setEditId(department.id)
    setDepartmentName(department.departmentName)
    setDescription(department.description || '')
    setError('')
  }

  function removeDepartment(id) {
    if (window.confirm('Are you sure you want to delete this department?')) {
      deleteDepartment(id)
        .then(() => {
          loadDepartments()
        })
        .catch((error) => {
          console.error(error)
          setError('Unable to delete department')
        })
    }
  }

  function cancelEdit() {
    setEditId(null)
    setDepartmentName('')
    setDescription('')
    setError('')
  }
  
return (
  <div className="container mt-4">
    <h2 className="text-center mb-4">
      {manage ? 'Manage Departments' : 'View Departments'}
    </h2>

    {manage && (
      <div className="card mb-4">
        <div className="card-header">
          <h5>{editId ? 'Update Department' : 'Add Department'}</h5>
        </div>

        <div className="card-body">
          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          <form onSubmit={saveDepartment}>
            <div className="mb-3">
              <label className="form-label">Department Name:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter department name"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description:</label>
              <textarea
                className="form-control"
                placeholder="Enter department description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-success">
              {editId ? 'Update Department' : 'Add Department'}
            </button>

            {editId && (
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            )}
          </form>
        </div>
      </div>
    )}

    {error && !manage && (
      <div className="alert alert-danger">{error}</div>
    )}

    <h4>Department List</h4>

    <table className="table table-bordered table-striped">
      
        <thead className="table-dark">
        <tr>
          <th>ID</th>
          <th>Department Name</th>
          <th>Description</th>
          {manage && <th>Actions</th>}
        </tr>
      </thead>

      <tbody>
        {departments.length === 0 ? (
          <tr>
            <td colSpan={manage ? 4 : 3} className="text-center">
              No departments found
            </td>
          </tr>
        ) : (
          departments.map((department) => (
            <tr key={department.id}>
              <td>{department.id}</td>
              <td>{department.departmentName}</td>
              <td>{department.description}</td>

              {manage && (
                <td>
                  <button
                    className="btn btn-info btn-sm me-2"
                    onClick={() => editDepartment(department)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeDepartment(department.id)}
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
)



}

export default DepartmentComponent
