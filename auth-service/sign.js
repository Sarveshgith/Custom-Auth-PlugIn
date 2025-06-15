const crypto = require('crypto');
const fs = require('fs');

const privateKey = fs.readFileSync('./private.pem', 'utf8');

function base64url(input) {
    return Buffer.from(input)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

function createToken(payload) {
    const header = {
        alg: 'RS256',
        typ: 'JWT'
    };

    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 3600;

    const tokenPayload = {
        ...payload,
        iat,
        exp
    };

    const headerB64 = base64url(JSON.stringify(header));
    const payloadB64 = base64url(JSON.stringify(tokenPayload));
    const signatureBase = `${headerB64}.${payloadB64}`;

    const signature = crypto.sign('sha256', Buffer.from(signatureBase), {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING
    });

    const signatureB64 = base64url(signature);

    return `${signatureBase}.${signatureB64}`;
}

module.exports = { createToken };