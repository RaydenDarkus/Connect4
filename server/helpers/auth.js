const crypto = require('crypto')

// Function to generate a random salt
const generateSalt = () => {
    return crypto.randomBytes(16).toString('hex')
}

// Function to hash a password using PBKDF2
const hashPassword = (password, salt) => {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, 200000, 64, 'sha512', (err, derivedKey) => {
            if (err) {
                reject(err)
            } else {
                resolve(derivedKey.toString('hex'))
            }
        })
    })
}

// Function to verify a password
const verifyPassword = async (password, hashedPassword, salt) => {
    const hashedInputPassword = await hashPassword(password, salt)
    return hashedInputPassword === hashedPassword
}

// Export the functions to authcontroller
module.exports = {
    generateSalt,
    hashPassword,
    verifyPassword
}