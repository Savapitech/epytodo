const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

router.post('/register', async (req, res) => {
    if (!req.body)
        return res.status(400).json({ msg: 'Bad parameter' });

    const { email, password, name, firstname } = req.body;

    if (!email || !password || !name || !firstname)
        return res.status(400).json({ msg: 'Bad parameter' });

    try {
        const [rows] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);

        if (rows.length > 0)
            return res.status(409).json({ msg: 'Account already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            'INSERT INTO user (email, password, name, firstname) VALUES (?, ?, ?, ?)',
            [email, hashedPassword, name, firstname]
        );

        const token = jwt.sign({ id: result.insertId }, process.env.SECRET, { expiresIn: '1h' });

        res.status(201).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    if (!req.body)
        return res.status(400).json({ msg: 'Bad parameter' });

    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ msg: 'Bad parameter' });

    try {
        const [rows] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);

        if (rows.length === 0)
            return res.status(401).json({ msg: 'Invalid Credentials' });

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch)
            return res.status(401).json({ msg: 'Invalid Credentials' });

        const token = jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

module.exports = router;
