const User = require('../models/user')
const { generateSalt, hashPassword, verifyPassword } = require('../helpers/auth')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const test = (req, res) => {
    res.json('test is working')
}

// Register a new user
const registerUser = async (req, res) => {
    try {
        const {username, email, password, cpassword} = req.body
        const usern = await User.findOne({username})
        if(usern) {
            return res.status(409).json({ 
                error: 'Username already exists'
            })
        }
        const useremail = await User.findOne({email})
        if(useremail) {
            return res.status(409).json({ 
                error: 'Email already exists'
            })
        }
        const passw = await User.findOne({password})
        if(passw) {
            return res.status(409).json({ 
                error: 'Password already exists'
            })
        }
        if(password.length < 6 || cpassword.length < 6) {
            return res.status(400).json({
                error: 'Password must be at least 6 characters long'
            })
        }
        if (password !== cpassword) {
            return res.status(400).json({
                error: 'Passwords do not match'
            })
        }

        // Regular expressions for checking password complexity
        const letterRegex = /[a-zA-Z]/
        const numberRegex = /[0-9]/
        const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/

        if (!letterRegex.test(password) || !numberRegex.test(password) || !specialCharRegex.test(password)) {
            return res.status(400).json({
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
        res.status(500).json({ error: 'Internal server error' })
    }
}

// Login a user
const loginUser = async (req, res) => {
    try {
        const {username, password} = req.body
        const user = await User.findOne({username})
        if (!user) {
            return res.status(404).json({
                error: 'Invalid username or user not found'
            })
        }
        // Verify password
        const isPasswordValid = await verifyPassword(password, user.password, user.salt);
        if (isPasswordValid) {
            // Password is correct
            jwt.sign({id: user._id, username: user.username}, process.env.JWT_SECRET, {expiresIn: '5h'}, (err, token) => {
                if (err) {
                    throw err
                }
                res.cookie('token', token, {httpOnly: true}).json(user)
            })
        } 
        else {
            // Password is incorrect
            console.log({ error: 'Invalid password' })
            return res.status(401).json({ error: 'Invalid password' })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' })
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
            res.status(200).json(user)
        })
    }
    else {
        res.json({message: 'No token found'})    
    }
}

// Logout a user
const logoutUser = (req, res) => {
    // Clear the JWT token cookie
    res.clearCookie('token')
    // Respond with a JSON message indicating successful logout
    res.json({ message: 'Logout successful' })
}

// Delete a user account
const deleteAccount = async (req, res) => {
    try {
        const userId  = req.body.id // Assuming userId is sent in the request body
        if (!userId) {
            console.log('User ID not provided')
            return res.status(400).json({ error: 'User ID not provided' })
        }
        const deletedUser = await User.findByIdAndDelete(userId)
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' })
        }
        res.clearCookie('token')
        res.json({ message: 'Account deleted successfully' })

    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({ error: 'Internal server error' })
    }
}


// Forgot password
const forgotPassword = async (req, res) => {
    const {username, email} = req.body
    try {
        const user = await User.findOne({ username, email })
        if (!user) {
            return res.status(401).json({ error: 'Username or email combination not found' })
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '5m'})
        
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'svpatil20000@gmail.com',
              pass: 'atry bdnm zlpq lzia'
            }
          })
          
        var mailOptions = {
            from: 'svpatil20000@gmail.com',
            to: email,
            subject: 'Reset Password',
            text: `http://localhost:5173/resetpassword/${token}`
        }
          
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              return res.json({ status: false, message: 'Email not sent: ' + error })
            } 
            else {
              return res.json({ status: true, message: 'Email sent: ' + info.response })
            }
        })
    } 
    catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

const resetPassword = async (req, res) => {
    const token = req.params.token
    const {password, cpassword} = req.body
    try {

        if(password.length < 6 || cpassword.length < 6) {
            return res.status(400).json({
                error: 'Password must be at least 6 characters long'
            })
        }

        if (password !== cpassword) {
            return res.status(400).json({
                error: 'Passwords do not match'
            })
        }

        const letterRegex = /[a-zA-Z]/
        const numberRegex = /[0-9]/
        const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/

        if (!letterRegex.test(password) || !numberRegex.test(password) || !specialCharRegex.test(password)) {
            return res.status(400).json({
                error: 'Password must contain at least one letter, one number, and one special character'
            })
        }

        const decoded = await jwt.verify(token, process.env.JWT_SECRET)
        const id = decoded.id
        const salt = generateSalt()
        const hashedPassword = await hashPassword(password, salt)

        await User.findByIdAndUpdate({_id: id}, {password: hashedPassword, salt: salt})
        return res.json({ message: 'Password reset successfully' })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Password reset failed' })
    }
}

// Export the functions to be used in routes
module.exports = {  
    test,
    registerUser,
    loginUser,
    getProfile,
    logoutUser,
    deleteAccount,
    forgotPassword,
    resetPassword
}