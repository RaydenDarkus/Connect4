import {useContext} from 'react'
import axios from 'axios'
import {UserContext} from './context/userContext'
import {useNavigate} from 'react-router-dom'
import toast from 'react-hot-toast'
import Board from './components/board/Board'
import './css/dashboard.css'
import DropZone from './components/dropzone/DropZone'

export default function Dashboard() {

    const { user, setUser } = useContext(UserContext); 
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('/logout'); // Make a POST request to the logout route
            setUser(null); // Clear the user context after logout
            toast.success('Logged out successfully');
            navigate('/'); // Navigate to the home or login page after logout
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='dashboard'>
            <h1>Dashboard</h1>
            <>
                {!!user && <h2>Welcome {user.username}</h2>}
            </>
            <h1>Connect 4</h1>
            
            <DropZone/>
            <Board/>
            
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}
