const HMAC_SHA256 = require('./HMAC_SHA256')

class PBKDF2 {
	
	/**
     * Derives a key using PBKDF2 with HMAC-SHA256.
     * @param {Buffer|string} salt - The salt value.
     * @param {Buffer|string} password - The password.
     * @param {number} iterations - The number of iterations.
     * @param {number} dkLen - Desired length of the derived key.
     * @return {string} The derived key as a hexadecimal string.
     */
    static deriveBytes(salt, password, iterations, dkLen) {
        salt = Buffer.isBuffer(salt) ? salt : Buffer.from(salt, 'utf-8');
        password = Buffer.isBuffer(password) ? password : Buffer.from(password, 'utf-8');

		// Buffer for the derived key
        let key = Buffer.alloc(dkLen, 0); 
		
		// Calculate the number of blocks needed
        let blockCount = Math.ceil(dkLen / HMAC_SHA256.blockSize); 

        for (let i = 1; i <= blockCount; i++) {
			
            let T = Buffer.alloc(0);
			
            let U = Buffer.concat([salt, Buffer.from([0, 0, 0, i])]);

            for (let j = 0; j < iterations; j++) {
				// U_j = HMAC(Password, U_{j-1})
                U = Buffer.from(HMAC_SHA256.hmac(password, U), 'hex');
				// Exclusive-OR U_j into T_i
                T = j === 0 ? U : Buffer.from(T.map((byte, index) => byte ^ U[index])); 
            }

			// Append T_i to output
            key = Buffer.concat([key.slice(0, HMAC_SHA256.blockSize * (i - 1)), T]); 
        }
		// Truncate to desired length
        return key.slice(0, dkLen).toString('hex');
    }
}

module.exports = PBKDF2;