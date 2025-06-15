const express = require('express');
const fs = require('fs');
const { createToken } = require('./sign');
const app = express();

app.use(express.json());

app.post('/issue-token', (req, res) => {
    const { userId, role } = req.body;
    if (!userId || !role) {
        return res.status(400).json({ error: 'UserId and role are required' });
    }
    try {
        const token = createToken({ userId: userId, role: role });
        res.json({ token });
    } catch (error) {
        console.error('Error creating token:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/public-key', (req, res) => {
    try {
        const pubKey = fs.readFileSync('./public.pem', 'utf8');
        res.type('text/plain').send(pubKey);
    } catch (error) {
        console.error('Error reading public key:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(3000, () => {
    console.log('Auth service running on port 3000');
});

