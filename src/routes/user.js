const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT id, email, password, DATE_FORMAT(CONVERT_TZ(created_at, '+00:00', '+00:00'), '%Y-%m-%d %H:%i:%s') AS created_at, firstname, name FROM user WHERE id = ?",
            [req.user.id]
        );

        if (rows.length < 1)
            return res.status(404).json({ msg: 'Not found' });

        res.json(rows[0]);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ msg: 'Internal server error' });
    }
});


router.get('/todos', auth, async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT id, title, description, DATE_FORMAT(CONVERT_TZ(due_time, '+00:00', '+00:00'), '%Y-%m-%d %H:%i:%s') AS due_time, DATE_FORMAT(CONVERT_TZ(created_at, '+00:00', '+00:00'), '%Y-%m-%d %H:%i:%s') AS created_at, user_id, status FROM todo WHERE user_id = ?", [req.user.id]);

        if (rows.length < 1)
            return res.status(404).json({ msg: 'Not found' });

        res.json(rows);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ msg: 'Internal server error' });
    }
});



module.exports = router;
