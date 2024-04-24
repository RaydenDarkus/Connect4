import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'
import '../css/registration.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { togglePasswordVisibility } from '../js/utils.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import {toast} from 'react-hot-toast'

export default function ResetPassword() {

  const navigate = useNavigate()
    
    const [showPassword, setShowPassword] = useState(false)
    const {token} = useParams()

    const handletogglePasswordVisibility = () => {
        togglePasswordVisibility(showPassword, setShowPassword)
    }

    const forgotPassword = async (e) => {
        e.preventDefault()
        const {password, cpassword} = data
        try {
            const {data} = await axios.post('/resetpassword/' + token , {
                password, cpassword
            })

            if(data.error) {
                return toast.error(data.error)
            }
            else {
                setData({})
                toast.success('User registered successfully')
                navigate('/Login')
            }
        } 
        catch (error) {
            console.log(error)
            if (error.response && error.response.status === 400)
                toast.error('Password requirements not met')
            if (error.response && error.response.status === 500)
                toast.error('Internal Server Error. Please try again later.')
        }
    }

    const [data, setData] = useState({
        password: "",
        cpassword: ""
    })

  return (
    <div className="wrapper d-flex align-items-center justify-content-center vh-100 bg-primary">
            <div className = "form-container 50-w p-5 bg-white rounded registration">
                <Link to="/" title='Home' className="btn btn-primary home-link btn-hover-shadow align-self-start">
                    <FontAwesomeIcon icon={faHome} className="fa-home"/>
                </Link>
                <form onSubmit={forgotPassword}>
                    <h2 className="text-center"> Reset Password </h2>
                    {/* <div className="mb-2">
                        <label htmlFor="username" className='input-text'>Username</label>
                        <input className="form-control" 
                            type="text" placeholder="Enter Username" id="username" name="username"
                            value={data.username} onChange={(e) => setData({...data, username: e.target.value})}
                        required/>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="email" className='input-text'>Email</label>
                        <input className="form-control" 
                            type="email" placeholder="Enter email" id="email" name="email"
                            value={data.email} onChange={(e) => setData({...data, email: e.target.value})}
                        required/>
                    </div> */}
                    <div className="mb-2">
                        <label htmlFor="password" className='input-text'>New Password</label>
                        <input className="form-control" 
                            type="text" placeholder="Enter Password" id="password" name="password" autoComplete="off"
                            value={data.password} onChange={(e) => setData({...data, password: e.target.value})}
                        required/>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="cpassword" className='input-text'>Confirm Password</label>
                        <div className="password-input-container">
                            <input type={showPassword ? "text" : "password"} className="form-control" 
                                placeholder="Enter Password" id="cpassword" name="cpassword" autoComplete='off'
                                value={data.cpassword} onChange={(e) => setData({...data, cpassword: e.target.value})}
                            required/>
                            <FontAwesomeIcon
                                icon={showPassword ? faEyeSlash : faEye}
                                className="fa-solid eye-icon"
                                onClick={handletogglePasswordVisibility}
                                title={showPassword ? "Hide Password" : "Show Password"}
                            />
                        </div>
                    </div>
                    <div className="d-grid mt-3">
                        <button className="btn btn-primary btn-hover-shadow" type='submit' title='Sign up'>Submit</button>
                    </div>
                    {/* <p className="text-center mt-2">
                        Already have an account? <Link className="hyperlinks" to="/Login">Login</Link>
                    </p> */}
                </form>
            </div>
        </div>
    )
}


