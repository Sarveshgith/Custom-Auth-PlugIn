const crypto = require('crypto');
const axios = require('axios');

async function fetchPubKey(token) {
    try {
        const res = await axios.get('http://localhost:3000/public-key');
        const pubKey = res.data;
        return pubKey;
    }
    catch (error) {
        console.error('Error fetching public key:', error);
        throw new Error('Could not fetch public key');
    }
};

function base64urlDecode(input) {
    input = input.replace(/-/g, '+').replace(/_/g, '/');
    while (input.length % 4) {
        input += '=';
    }
    return Buffer.from(input, 'base64');
};

async function verifyToken(token) {
    const [headerB64, payloadB64, signatureB64] = token.split('.');
    const signatureBase = `${headerB64}.${payloadB64}`;
    const signature = base64urlDecode(signatureB64);

    const pubKey = await fetchPubKey(token);

    const isValid = crypto.verify('sha256', Buffer.from(signatureBase), {
        key: pubKey,
        padding: crypto.constants.RSA_PKCS1_PADDING
    }, signature);

    if (!isValid) {
        throw new Error('Invalid token signature');
    }

    const payload = JSON.parse(base64urlDecode(payloadB64).toString('utf8'));
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp < currentTime) {
        throw new Error('Token has expired');
    }
    return { valid: true, payload: payload };
}

module.exports = { verifyToken };