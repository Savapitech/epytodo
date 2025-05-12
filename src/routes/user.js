const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, email, password, created_at, firstname, name FROM user WHERE id = ?',
            [req.user.id]
        );

        if (rows.length < 1)
            return res.status(404).json({ msg: 'User not found' });

        res.json(rows[0]);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

module.exports = router;
