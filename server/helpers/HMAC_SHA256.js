const SHA256 = require('./SHA256');

class HMAC_SHA256 {
    static blockSize = 64; // SHA-256 block size in bytes

	/**
     * Computes HMAC using SHA-256.
     * @param {Buffer|string} key - The key for HMAC.
     * @param {Buffer|string} message - The message to hash.
     * @return {string} The resulting HMAC as a hexadecimal string.
     */
    static hmac(key, message) {
        key = Buffer.isBuffer(key) ? key : Buffer.from(key);
        message = Buffer.isBuffer(message) ? message : Buffer.from(message);

		// If key is longer than block size, hash it
        if (key.length > this.blockSize) {
            key = Buffer.from(SHA256.hash(key), 'hex');  
        }
        
		key = this.padKey(key);

        const oKeyPad = this.createPad(key, 0x5c);  // Outer padded key
        const iKeyPad = this.createPad(key, 0x36);  // Inner padded key
		
		
		// Hash the inner pad concatenated with the message
        const innerHash = SHA256.hash(Buffer.concat([iKeyPad, message]));  
		
		// Hash the outer pad concatenated with the inner hash
        const finalHash = SHA256.hash(Buffer.concat([oKeyPad, Buffer.from(innerHash, 'hex')]));  

        return finalHash;
    }
	
	/**
     * Pads the key for HMAC processing.
     * @param {Buffer} key - The original key.
     * @return {Buffer} The padded key.
     */
    static padKey(key) {
        if (key.length < this.blockSize) {
            return Buffer.concat([key, Buffer.alloc(this.blockSize - key.length, 0)]);
        }
        return key;
    }
	
	/**
     * Creates a padded key by XORing each byte with a pad value.
     * @param {Buffer} key - The key to pad.
     * @param {number} padValue - The padding byte value.
     * @return {Buffer} The XORed padded key.
     */
    static createPad(key, padValue) {
        return key.map(byte => byte ^ padValue);
    }
}

module.exports = HMAC_SHA256;
