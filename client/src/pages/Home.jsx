import '../css/index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className='home container-fluid bg-primary'>
      <div className="inside-home container">
        <h2 className='connect-4-heading'>Connect 4</h2>
        <p className='text'> Please Login or Signup to play</p>
        <div className="button-container">
        <Link to="/login" className='btn btn-primary btn-hover-shadow btn-blink' title='Login'>Login</Link>
        <Link to="/signup" className='btn btn-primary btn-hover-shadow btn-blink' title='Sign up'>Sign Up</Link>
        </div>
      </div>
    </div>
  );
}

