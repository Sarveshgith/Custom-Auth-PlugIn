const express = require('express');
const fs = require('fs');
const { createToken } = require('./sign');
const app = express();

app.use(express.json());

app.post('/issue-token', (req, res) => {
    const { user, role } = req.body;
    if (!user || !role) {
        return res.status(400).json({ error: 'User and role are required' });
    }
    try {
        const token = createToken({ sub: user, role });
        res.json({ token });
    } catch (error) {
        console.error('Error creating token:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

