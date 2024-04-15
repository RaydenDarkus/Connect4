import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import './css/registration.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import {toast} from 'react-hot-toast'

function Signup() {

    const navigate = useNavigate()

    const forgotPassword = async (e) => {
        e.preventDefault();
        const {username, email} = data
        try {
            const {data} = await axios.post('/forgotpassword', {
                username, email
            })

            if(data.error) {
                return toast.error(data.error)
            }
            else {
                setData({})
                toast.success('Check your registered email for password recovery link')
                navigate('/Login')
            }
        } 
        catch (error) {
            console.log(error)
        }
    }

    const [data, setData] = useState({
        username: "",
        email: ""
    })

    return (
        <>
        {/* <link rel="stylesheet" href="/fontawesome-free-6.5.2-web/css/all.min.css?url"></link> */}
        {/* <link rel="stylesheet" href="/css/registration.css?url"></link> */}
        <div className="wrapper d-flex align-items-center justify-content-center vh-100 bg-primary">
            <div className = "form-container 50-w p-5 bg-white rounded registration">
                <Link to="/" title='Home' className="btn btn-primary home-link btn-hover-shadow align-self-start">
                    <FontAwesomeIcon icon={faHome} className="fa-home"/>
                </Link>
                <form onSubmit={forgotPassword}>
                    <h2 className="text-center">Forgot Password</h2>
                    <div className="mb-2">
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
                    </div>
                    <div className="d-grid mt-3">
                        <button className="btn btn-primary btn-hover-shadow" type='submit' title='Send'>Send</button>
                    </div>
                    <p className="text-center mt-2">
                        Do you remember your password? <Link className="hyperlinks" to="/Login">Login</Link>
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

export default Signup