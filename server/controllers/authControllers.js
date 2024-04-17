const User = require('../models/user')
const { generateSalt, hashPassword, verifyPassword } = require('../helpers/auth')
const jwt = require('jsonwebtoken')

const test = (req, res) => {
    res.json('test is working')
}

// Register a new user
const registerUser = async (req, res) => {
    try {
        const {username, email, password, cpassword} = req.body
        const usern = await User.findOne({username})
        if(usern) {
            return res.json({ 
                error: 'Username already exists'
            })
        }
        const useremail = await User.findOne({email})
        if(useremail) {
            return res.json({ 
                error: 'Email already exists'
            })
        }
        const passw = await User.findOne({password})
        if(passw) {
            return res.json({ 
                error: 'Password already exists'
            })
        }
        if(password.length < 6 || cpassword.length < 6) {
            return res.json({
                error: 'Password must be at least 6 characters long'
            })
        }
        if (password !== cpassword) {
            return res.json({
                error: 'Passwords do not match'
            })
        }

        // Regular expressions for checking password complexity
        const letterRegex = /[a-zA-Z]/
        const numberRegex = /[0-9]/
        const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/

        if (!letterRegex.test(password) || !numberRegex.test(password) || !specialCharRegex.test(password)) {
            return res.json({
                error: 'Password must contain at least one letter, one number, and one special character'
            })
        }
        // Hash password
        const salt = generateSalt();
        const hashedPassword = await hashPassword(password, salt);
        const user = await User.create({
            username, 
            email,
            password: hashedPassword,
            salt
        })
        await user.save()
        return res.json(user)
    }

    catch (error) {
        console.log(error)
    }
}

// Login a user
const loginUser = async (req, res) => {
    try {
        const {username, password} = req.body
        const user = await User.findOne({username})
        if (!user) {
            return res.json({
                error: 'Invalid username or user not found'
            })
        }
        // Verify password
        const isPasswordValid = await verifyPassword(password, user.password, user.salt);
        if (isPasswordValid) {
            // Password is correct
            jwt.sign({id: user._id, username: user.username}, process.env.JWT_SECRET, {}, (err, token) => {
                if (err) {
                    throw err
                }
                res.cookie('token', token, {httpOnly: true}).json(user)
            })
        } 
        else {
            // Password is incorrect
            return res.json({ error: 'Invalid password' })
        }
    }
    catch (error) {
        console.log(error)
    }
}

// Get profile of a user
const getProfile = (req, res) => {
    const token = req.cookies.token
    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
            if (err) { 
                throw err
            }
            res.json(user)
        })
    }
    else {
        res.json(null)    
    }
}

// Logout a user
const logoutUser = (req, res) => {
    // Clear the JWT token cookie
    res.clearCookie('token')

    // Respond with a JSON message indicating successful logout
    res.json({ message: 'Logout successful' })
};

// Forgot password
const forgotPassword = async (req, res) => {
    const {username, email} = req.body
    try {
        const user = await User.findOne({ username, email })
        if (!user) {
            return res.json({
                error: 'Username or email combination not found'
            })
        }
    } catch (error) {
        console.log(error)
    }
}

// Export the functions to be used in routes
module.exports = {  
    test,
    registerUser,
    loginUser,
    getProfile,
    logoutUser,
    forgotPassword
};