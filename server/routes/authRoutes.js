const express = require('express')
const router = express.Router()
const cors = require('cors')
const { test, registerUser, getProfile, loginUser, logoutUser, deleteAccount, forgotPassword, resetPassword } = require('../controllers/authControllers')

//middleware
router.use(
    cors({
    credentials: true,
    origin: 'http://localhost:5173'
    })
)

// Routes
router.get('/', test)
router.post('/signup', registerUser)
router.post('/login', loginUser)
router.get('/profile', getProfile)
router.post('/logout', logoutUser)
router.post('/deleteaccount', deleteAccount)
router.post('/forgotpassword', forgotPassword)
router.post('/resetpassword/:token', resetPassword)

module.exports = router