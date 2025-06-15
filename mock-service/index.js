const express = require('express');
const { verifyToken } = require('./verify');
const app = express();

app.use(express.json());

app.get('/main', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Authorization token required' });
    }

    const response = await verifyToken(token);

    if (response.valid) {
        res.status(200).json({
            status: 'success',
            message: `Welcome user ${response.payload.userId}, role: ${response.payload.role}`,
        });
    } else {
        res.status(401).json({ error: 'Invalid token' });
    }
});

app.listen(4000, () => {
    console.log('Mock service running on port 4000');
});