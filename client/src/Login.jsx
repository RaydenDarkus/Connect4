import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './css/registration.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { togglePasswordVisibility } from './js/utils.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faHome } from '@fortawesome/free-solid-svg-icons'
import toast from 'react-hot-toast'

function Login() {

    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false);

    const handletogglePasswordVisibility = () => {
        togglePasswordVisibility(showPassword, setShowPassword);
    };

    const loginUser = async (e) => { 
        e.preventDefault()
        const {username, password} = data
        try {
            const {data} = await axios.post('/login', { 
                username, password 
            })

            if (data.error) {
                return toast.error(data.error)
            }
            else {
                setData({})
                toast.success('Login successful')
                navigate('/dashboard')
            }
        } 
        catch (error) {
            console.log(error)
        }
    }

    const [data, setData] = useState({
        username: "",
        password: "",
    })
    
    return (
        <>
        {/* <link rel="stylesheet" href="/css/registration.css?url"></link> */}
        <div className="wrapper d-flex align-items-center justify-content-center vh-100 bg-primary">
            <div className = "form-container 50-w p-5 bg-white rounded registration">
                <Link to="/" title='Home' className="btn btn-primary home-link btn-hover-shadow">
                    <FontAwesomeIcon icon={faHome} className="fa-home"/>
                </Link>
                <form onSubmit={loginUser}>
                    <h2 className="text-center">Sign in</h2>
                    <div className="mb-2">
                        <label htmlFor="username" className='input-text'>Username</label>
                        <input className="form-control" 
                            type="text" placeholder="Enter Username" id="username" name="username" 
                            value={data.username} onChange={(e) => setData({...data, username: e.target.value})}
                        required/>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="password" className='input-text'>Password</label>
                        <div className="password-input-container">
                            <input type={showPassword ? "text" : "password"} className="form-control" 
                                placeholder="Enter Password" id="password" name="password"  autoComplete='off'
                                value={data.password} onChange={(e) => setData({...data, password: e.target.value})}
                            required/>
                            <FontAwesomeIcon
                                icon={showPassword ? faEyeSlash : faEye}
                                className="fa-solid eye-icon"
                                onClick={handletogglePasswordVisibility}
                                title={showPassword ? "Hide Password" : "Show Password"}
                            />
                        </div>
                    </div>
                    <div className="mb-2">
                        <input type="checkbox" className="custom-control custom-checkbox" id="check"></input>
                        <label htmlFor="check" className="custom-input-label ms-2">Remember Me</label>
                    </div>
                    <div className="d-grid">
                        <button className="btn btn-primary btn-hover-shadow" type='submit' title='Login'>Login</button>
                    </div>
                    <p className="text-center mt-2">
                        Forgot <Link className="hyperlinks" to="/forgotpassword" >Password?</Link>
                    </p>
                    <p className="text-center">
                        Don&apos;t have an account? <Link className="hyperlinks" to="/signup">Sign up</Link>
                    </p>
                </form>
            </div>
        </div>
        </>
    )
}

export default Login