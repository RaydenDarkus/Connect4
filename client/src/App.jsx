import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import axios from 'axios'
import Signup from './Signup'  
import Login from './Login'  
import Home from './Home'
import ForgotPassword from './ForgotPassword'
import ResetPassword from './ResetPassword'
import {Toaster} from 'react-hot-toast'
import { UserContextProvider } from './context/userContext'
import Dashboard from './Dashboard'

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

export default function App() {

  return (
    <UserContextProvider>
      <BrowserRouter>
        <Toaster position='bottom-right' toastOptions={{duration: 3000}} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/forgotpassword" element={<ForgotPassword />}></Route>
          <Route path="/resetpassword" element={<ResetPassword />}></Route>
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
  )
}