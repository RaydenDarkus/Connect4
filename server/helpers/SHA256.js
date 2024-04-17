class SHA256 {
    static k = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];
	
	static initialHashes = [
        0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
        0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ]
		
	/**
     * Computes SHA-256 hash for the given message.
     * @param {Buffer|string} message - Input message to hash.
     * @return {string} Hexadecimal hash string.
     */

    static hash(message) {
        const messageBlocks = this.preprocess(message);
        let hashValues = [...this.initialHashes];

        messageBlocks.forEach(block => {
            const w = this.scheduleWords(block);
			this.compressionRound(w, hashValues)
            
        });

        return hashValues.reduce((hexHash, val) => hexHash + val.toString(16).padStart(8, '0'), '');
    }
	
	/**
     * Prepares the message blocks for hashing.
     * @param {Buffer|string} message - Input message.
     * @return {Buffer[]} Array of message blocks.
     */
    static preprocess(message) {
        const buffer = Buffer.isBuffer(message) ? message : Buffer.from(message);
        const messageLength = buffer.length * 8;
        const withOne = Buffer.concat([buffer, Buffer.from([0x80])]);

        let lengthBlock = Buffer.alloc(8);
        lengthBlock.writeUInt32BE((messageLength / Math.pow(2, 32)) >>> 0, 0);
        lengthBlock.writeUInt32BE(messageLength >>> 0, 4);

        let paddedMessage = Buffer.concat([
			withOne, 
			Buffer.alloc(((448 - (messageLength + 1) % 512 + 512) % 512) / 8), lengthBlock
		]);

        const messageBlocks = [];
        for (let i = 0; i < paddedMessage.length / 64; i++) {
            messageBlocks.push(paddedMessage.slice(i * 64, (i + 1) * 64));
        }

        return messageBlocks;
    }
	
	 /**
     * Schedule words for a single message block.
     * @param {Buffer} block - The message block to schedule.
     * @return {number[]} Scheduled words array.
     */
    static scheduleWords(block) {
        let w = new Array(64);
        for (let i = 0; i < 16; i++) {
            w[i] = block.readUInt32BE(i * 4);
        }
        for (let i = 16; i < 64; i++) {
            const s0 = SHA256.rotr(w[i - 15], 7) ^ SHA256.rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
            const s1 = SHA256.rotr(w[i - 2], 17) ^ SHA256.rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
            w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
        }
        return w;
    }
	
	/**
     * Perform the main compression round of SHA-256.
     * @param {number[]} words - Scheduled words for this block.
     * @param {number[]} hashValues - Current hash values.
     */
    static compressionRound(words, hashValues) {
        let [a, b, c, d, e, f, g, h] = hashValues;

        for (let i = 0; i < 64; i++) {
            const S1 = SHA256.rotr(e, 6) ^ SHA256.rotr(e, 11) ^ SHA256.rotr(e, 25);
            const ch = (e & f) ^ (~e & g);
            const temp1 = (h + S1 + ch + this.k[i] + words[i]) >>> 0;
            const S0 = SHA256.rotr(a, 2) ^ SHA256.rotr(a, 13) ^ SHA256.rotr(a, 22);
            const maj = (a & b) ^ (a & c) ^ (b & c);
            const temp2 = (S0 + maj) >>> 0;

            h = g;
            g = f;
            f = e;
            e = (d + temp1) >>> 0;
            d = c;
            c = b;
            b = a;
            a = (temp1 + temp2) >>> 0;
        }

        hashValues[0] += a;
        hashValues[1] += b;
        hashValues[2] += c;
        hashValues[3] += d;
        hashValues[4] += e;
        hashValues[5] += f;
        hashValues[6] += g;
        hashValues[7] += h;
    }

    /**
     * Bitwise rotate right.
     * @param {number} x - Value to rotate.
     * @param {number} n - Number of bits to rotate.
     * @return {number} Rotated value.
     */
    static rotr(x, n) {
        return (x >>> n) | (x << (32 - n));
    }
}

module.exports = SHA256;