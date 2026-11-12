// import React,{useEffect, useState} from 'react'
// import { deleteEmployee, listEmployees } from '../services/EmployeeService'
// import { useNavigate } from 'react-router-dom'


// const ListEmpComp = () => {
//    const[employees,setEmployees]= useState([])
//    const navigator =useNavigate();
//    useEffect(() =>{
//         getAllEmployees();
//    },[])

//    function getAllEmployees(){
//         listEmployees().then((response)=>{
//         setEmployees(response.data);
//      }).catch(error => {
//             console.error(error);
//     })
//    }

//    function addNewEmployee(){
//         navigator('/add-employee')
//    }
//    function updateEmployee(id){
//     navigator(`/edit-employee/${id}`)
//    }
//    function removeEmployee(id){
//     console.log(id);
//     deleteEmployee(id).then((response)=>{
//         getAllEmployees();

//     }).catch(error=> {
//         console.error(error);
//     })
//    }
   
//   return (
//     <div className='container'> 
//         <h2 className='text-center'>List of employees</h2>
//         <button className='btn btn-primary mb-2' onClick={addNewEmployee}>Add Employee</button>
//     <table className='table table-striped table-bordered'>
//     <thead>

//         <tr>
//             <th> employee id</th>
//             <th>employee first name</th>
//             <th>employee last name</th>
//             <th> employee email id</th>
//             <th>Actions</th>
//         </tr>
//     </thead>
//     <tbody>
//         {
//             employees.map(employee => 
//                 <tr key={employee.id}>
//                     <td>{employee.id}</td>
//                     <td>{employee.firstName}</td>
//                     <td>{employee.lastName}</td>
//                     <td>{employee.email}</td>
//                     <td>
//                         <button className='btn btn-info' onClick={() => updateEmployee(employee.id)}>
//                             update
//                         </button>
//                         <button className='btn btn-danger' onClick={() => removeEmployee(employee.id)}
//                             style={{marginLeft :'10px'}}>
//                             Delete
//                         </button>
//                     </td>
//                 </tr>
//             )
//         }
//     </tbody>
//     </table>
//     </div>
    
//   )

// }


// export default ListEmpComp




import React, { useEffect, useState } from 'react'
import {
  deleteEmployee,
  listEmployees
} from '../services/EmployeeService'
import { useNavigate } from 'react-router-dom'

const ListEmpComp = () => {

  const [employees, setEmployees] = useState([])
  const navigator = useNavigate()

  useEffect(() => {
    getAllEmployees()
  }, [])

  function getAllEmployees() {
    listEmployees()
      .then((response) => {
        setEmployees(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  function addNewEmployee() {
    navigator('/add-employee')
  }

  function updateEmployee(id) {
    navigator(`/edit-employee/${id}`)
  }

  function removeEmployee(id) {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      deleteEmployee(id)
        .then(() => {
          getAllEmployees()
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }

  return (
    <div className="container mt-4">

      <h2 className="text-center mb-4">
        Employee Management
      </h2>

      <button
        className="btn mb-3 attendance-btn"
        onClick={addNewEmployee}
      >
        Add Employee
      </button>

      <div className="table-responsive">
        <table className="table table-striped table-bordered">

          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>

                <td>{employee.id}</td>
                <td>{employee.firstName}</td>
                <td>{employee.lastName}</td>
                <td>{employee.email}</td>
                <td>{employee.department}</td>
                <td>{employee.designation}</td>

                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => updateEmployee(employee.id)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm ms-2"
                    onClick={() => removeEmployee(employee.id)}
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  )
}

export default ListEmpComp
