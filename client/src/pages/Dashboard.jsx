import {useState, useContext, useEffect} from 'react'
import axios from 'axios'
import {UserContext} from '../context/userContext'
import {useNavigate} from 'react-router-dom'
import toast from 'react-hot-toast'
import '../css/dashboard.css'
import Game from './Game'

export default function Dashboard() {

    const { user, setUser } = useContext(UserContext)
    const [showRulesModal, setShowRulesModal] = useState(false)
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await axios.post('/logout') // Make a POST request to the logout route
            setUser(null) // Clear the user context after logout
            toast.success('Logged out successfully')
            navigate('/') // Navigate to the home or login page after logout
        } catch (error) {
            console.log(error)
        }
    }

    const handleShowRulesModal = () => {
    setShowRulesModal(true)
    }

    const handleCloseRulesModal = () => {
    setShowRulesModal(false)
    }

    const DeleteAccount = async () =>{
        try {
            // setUser(null)
            // toast.success('Account deleted successfully')
            // navigate('/')
        }
        catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='dashboard'>
            <header className="header">
                <h1 className="title">Connect 4</h1>
                {!!user && <h2 className="welcome">Welcome, {user.username}!</h2>}
            </header>
            <main className="content">
                <section className="game-section">
                    <Game />
                </section>
                <section className="actions-section">
                    <h2 className="actions-title">Actions</h2>
                    <button className="logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                    <button className="logout-btn" onClick={DeleteAccount}>
                        Delete User
                    </button>
                    <button className="logout-btn" onClick={handleShowRulesModal}>
                        Game Rules
                    </button>
                </section>
            </main>

            <div className={`modal ${showRulesModal ? 'show' : ''}`}>
                <div className="modal-content">
                    <span className="close-button" onClick={handleCloseRulesModal}>
                    &times;
                    </span>
                    <h2>Game Rules</h2>
                    <p>
                    Here are the rules for the game:
                    <ul>
                        <li>Use left and right arrows to move the drop coin</li>
                        <li>Use Enter or Space Button to drop the coin</li>
                        <li>Connect 4 coins horizontally, vertically or diagonally for a player to win</li>
                    </ul>
                    </p>
                </div>
            </div>

            <footer className="footer">
                <p className="copyright">&copy; 2024 Connect4 Dashboard</p>
            </footer>
        </div>
    )
}
