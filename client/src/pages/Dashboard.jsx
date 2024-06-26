import {useState, useContext} from 'react'
import axios from 'axios'
import {UserContext} from '../context/userContext'
import {useNavigate} from 'react-router-dom'
import toast from 'react-hot-toast'
import '../css/dashboard.css'
import Game from './Game'

export default function Dashboard() {

    const { user, setUser } = useContext(UserContext)
    const [showRulesModal, setShowRulesModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showLogoutModal, setShowLogoutModal] = useState(false)
    const navigate = useNavigate()

    const handleLogout = async (e) => {
        try {
            e.preventDefault()
            const userId = user._id
            console.log(userId)
            await axios.post('/logout', {userId}) // Make a POST request to the logout route
            setUser(null) // Clear the user context after logout
            toast.success('Logged out successfully')
            navigate('/') // Navigate to the home or login page after logout
        } catch (error) {
            console.log(error)
        }
    }

    const handleShowLogoutModal = () => {
        setShowLogoutModal(true)
    }

    const handleCloseLogoutModal = () => {
        setShowLogoutModal(false)
    }

    const handleShowRulesModal = () => {
        setShowRulesModal(true)
    }

    const handleCloseRulesModal = () => {
        setShowRulesModal(false)
    }

    const handleShowDeleteModal = () => {
        setShowDeleteModal(true)
    }

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false)
    }

    const deleteAccount = async (id) => {
        try {
            await axios.post('/deleteaccount', {id: id})
            setUser(null)
            toast.success('Account deleted successfully')
            navigate('/')
        }
        catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='dashboard'>
            <header className="header">
                <h1 className="title">Connect 4</h1>
                {user && <h2 className="welcome">Welcome, {user?.username}!</h2>}
            </header>
            <main className="content">
                <section className="game-section">
                    <Game />
                </section>
                <section className="actions-section">
                    <h2 className="actions-title">Actions</h2>
                    <button className="logout-btn" onClick={handleShowLogoutModal} title='Logout'>
                        Logout
                    </button>
                    <button className="logout-btn" onClick={handleShowDeleteModal} title='Delete Account'>
                        Delete User
                    </button>
                    <button className="logout-btn" onClick={handleShowRulesModal} title='Show Rules'>
                        Game Rules
                    </button>
                </section>
            </main>

            <div className={`modal ${showLogoutModal ? 'show' :''}`}>
                <div className="modal-content">
                    <span className="close-button" onClick={handleCloseLogoutModal}>
                    &times;
                    </span>
                    <h2>Logout</h2>
                    <div>
                        Are you sure you want to Logout?
                    </div>
                    <div className="button-container">
                        <button className="delete-btn" onClick={handleLogout} title='Confirm to Logout'> Logout </button>
                        <button className="cancel-btn" onClick={handleCloseLogoutModal} title='Cancel'> Cancel </button>
                    </div>
                </div>
            </div>

            <div className={`modal ${showDeleteModal ? 'show' :''}`}>
                <div className="modal-content">
                    <span className="close-button" onClick={handleCloseDeleteModal}>
                    &times;
                    </span>
                    <h2>Delete Account</h2>
                    <div>
                        Are you sure you want to delete your account?
                    </div>
                    <div className="button-container">
                        {!! user && <button className="delete-btn" onClick={() => deleteAccount(user.id)} title='Confirm to Delete'>
                            Delete
                        </button>}
                        <button className="cancel-btn" onClick={handleCloseDeleteModal} title='Cancel'> Cancel </button>
                    </div>
                </div>
            </div>

            <div className={`modal ${showRulesModal ? 'show' : ''}`}>
                <div className="modal-content">
                    <span className="close-button" onClick={handleCloseRulesModal} title='Close'>
                    &times;
                    </span>
                    <h2>Game Rules</h2>
                    <div>
                        Here are the rules for the game:
                        <ul>
                            <li>Use left and right arrows to move the drop coin</li>
                            <li>Use Enter or Space Button to drop the coin</li>
                            <li>Connect 4 coins horizontally, vertically or diagonally for a player to win</li>
                        </ul>
                    </div>
                </div>
            </div>

            <footer className="footer">
                <p className="copyright">&copy; 2024 Connect4 Dashboard</p>
            </footer>
        </div>
    )
}
