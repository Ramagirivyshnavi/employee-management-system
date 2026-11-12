// import './App.css'
// import EmployeeComponent from './components/EmployeeComponent';
// import FooterComponent from './components/FooterComponent';
// import HeaderComponent from './components/HeaderComponent';
// import ListEmpComp from './components/ListEmpComp';
// import { BrowserRouter ,Route,Routes} from 'react-router-dom';
// import DepartmentComponent from './components/DepartmentComponent'
// import HomeComponent from './components/HomeComponent';
// import AttendanceComponent from './components/AttendanceComponent';

// function App() {
 

//   return (
//     <>
//     <BrowserRouter>
//             <HeaderComponent/>

//                                 <Routes>
//                     {/* Home Dashboard */}
//                     <Route path='/' element={<HomeComponent />} />

//                     {/* Employees */}
//                     <Route path='/employees' element={<ListEmpComp />} />

//                     {/* Add Employee */}
//                     <Route path='/add-employee' element={<EmployeeComponent />} />

//                     {/* Edit Employee */}
//                     <Route path='/edit-employee/:id' element={<EmployeeComponent />} />

//                     {/* Departments */}
//                     <Route path='/departments' element={<DepartmentComponent />} />
//                     <Route path='/attendance' element={<AttendanceComponent />} />
//                   </Routes>
            
              
//               <FooterComponent/>
//        </BrowserRouter>
    
//     </>
//   )
// }

// export default App;

import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import EmployeeComponent from './components/EmployeeComponent';
import FooterComponent from './components/FooterComponent';
import HeaderComponent from './components/HeaderComponent';
import ListEmpComp from './components/ListEmpComp';
import DepartmentComponent from './components/DepartmentComponent';
import HomeComponent from './components/HomeComponent';
import AttendanceComponent from './components/AttendanceComponent';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPasswordComponent from "./components/ForgotPasswordComponent";
import { Link } from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
        <div className="app-layout">
            <HeaderComponent />
                 <main className="main-content">

            <Routes>
                {/* Login and Registration */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Home */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <HomeComponent />
                        </ProtectedRoute>
                    }
                />

                {/* Employees */}
                <Route
                    path="/employees"
                    element={
                        <ProtectedRoute>
                            <ListEmpComp />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/add-employee"
                    element={
                        <ProtectedRoute>
                            <EmployeeComponent />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/edit-employee/:id"
                    element={
                        <ProtectedRoute>
                            <EmployeeComponent />
                        </ProtectedRoute>
                    }
                />

                {/* Departments */}
               {/* View Departments */}
                            <Route
                                path="/departments"
                                element={
                                    <ProtectedRoute>
                                        <DepartmentComponent manage={false} />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Manage Departments */}
                            <Route
                                path="/manage-departments"
                                element={
                                    <ProtectedRoute>
                                        <DepartmentComponent manage={true} />
                                    </ProtectedRoute>
                                }
                            />

                {/* Attendance */}
                <Route
                    path="/attendance"
                    element={
                        <ProtectedRoute>
                            <AttendanceComponent />
                        </ProtectedRoute>
                    }
                />

                {/* Unknown paths */}
                <Route path="*" element={<Login />} />
                              <Route
                  path="/forgot-password"
                  element={<ForgotPasswordComponent />}
              />
            </Routes>
            </main>

            <FooterComponent />
            </div>
        </BrowserRouter>
    );
}

export default App;
