const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/signup', async (req, res) => {
    try {
        const user = await User.create(req.body);
      console.log(user)
        res.status(201).json(user);
    } catch (err) {
      console.log(err)
        res.status(500).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.authenticate(req.body);
        console.log(user)
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        res.json(user);
    } catch (err) {
      console.log(err)
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;