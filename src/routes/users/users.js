const express = require('express');
const router = express.Router({ mergeParams: true });
const bcrypt = require('bcryptjs');
const pool = require('../../config/db');
const auth = require('../../middleware/auth');

router.get('/', auth, async (req, res) => {
    const data = req.params.data

    try {
        const [rows] = await pool.query(
            "SELECT id, email, password, DATE_FORMAT(CONVERT_TZ(created_at, '+00:00', '+00:00'), '%Y-%m-%d %H:%i:%s') AS created_at, firstname, name FROM user WHERE id = ? OR email = ?",
            [data, data]
        );

        if (rows.length < 1)
            return res.status(404).json({ msg: 'Not found' });

        res.json(rows[0]);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

router.put('/', auth, async (req, res) => {
    if (!req.body)
        return res.status(400).json({ msg: 'Bad parameter' });
    const { email, password, firstname, name } = req.body;
    if (!email || !password || !firstname || !name)
        return res.status(400).json({ msg: 'Bad parameter' });
    const id = req.params.data;

    try {
        let [rows] = await pool.query(
            'SELECT id, email, password, created_at, firstname, name FROM user WHERE id = ?',
            [id]
        );

        if (rows.length < 1)
            return res.status(404).json({ msg: 'Not found' });
        const hashedPassword = await bcrypt.hash(password, 10)
        rows = await pool.query(
            'UPDATE user SET email = ?, password = ?, firstname = ?, name = ? WHERE id = ?',
            [email, hashedPassword, firstname, name, id]
        );

        if (rows.length < 1)
            return res.status(404).json({ msg: 'Not found' });

        rows = await pool.query(
            "SELECT id, email, password, DATE_FORMAT(CONVERT_TZ(created_at, '+00:00', '+00:00'), '%Y-%m-%d %H:%i:%s') AS created_at, firstname, name FROM user WHERE id = ?",
            [id]
        );

        if (rows.length < 1)
            return res.status(404).json({ msg: 'Not found' });
        res.json(rows[0][0]);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

router.delete('/', auth, async (req, res) => {
    const id = req.params.data

    try {
        let [rows] = await pool.query('SELECT * FROM user WHERE id = ?', [id]);

        if (rows.length < 1)
            return res.status(404).json({ msg: 'Not found' });

        rows = await pool.query(
            'DELETE FROM user WHERE id = ?',
            [id]
        );

        if (rows.length < 1)
            return res.status(404).json({ msg: 'Not found' });

        res.json({ msg: `Successfully deleted record number : ${id}` });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

module.exports = router;
