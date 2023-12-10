import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from './components/Login/Login'
import {BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom'
import Dashboard from './components/Dashboard/Dashboard'
import Home from './components/Home/Home'
import Employee from './components/Employee/Employee'
import Department from './components/Department/Department'
import Profile from './components/Profile/Profile'
import AddDepartment from './components/AddDepartment/AddDepartment'
import AddEmployee from './components/AddEmployee/AddEmployee'
import EditEmployee from './components/EditEmployee/EditEmployee'
import Start from './components/Start/Start'
import EmployeeLogin from './components/EmployeeLogin/EmployeeLogin'
import EmployeeDetail from './components/EmployeeDetail/EmployeeDetail'
import PrivateRoute from './Components/PrivateRoute/PrivateRoute'

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Start />}></Route>
      <Route path='/adminlogin' element={<Login />}></Route>
      <Route path='/employee_login' element={<EmployeeLogin />}></Route>
      <Route path='/employee_detail/:id' element={<EmployeeDetail />}></Route>
      <Route path='/dashboard' element={
        <PrivateRoute >
          <Dashboard />
        </PrivateRoute>
      }>
        <Route path='' element={<Home />}></Route>
        <Route path='/dashboard/employee' element={<Employee />}></Route>
        <Route path='/dashboard/department' element={<Department />}></Route>
        <Route path='/dashboard/profile' element={<Profile />}></Route>
        <Route path='/dashboard/add_department' element={<AddDepartment />}></Route>
        <Route path='/dashboard/add_employee' element={<AddEmployee />}></Route>
        <Route path='/dashboard/edit_employee/:id' element={<EditEmployee />}></Route>
      </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App