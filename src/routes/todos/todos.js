const express = require('express');
const router = express.Router();
const pool = require('../../config/db');
const auth = require('../../middleware/auth');

router.get('/', auth, async (req, res) => {
    try {
        const [todos] = await pool.query('SELECT * FROM todo');
        res.json(todos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

router.get('/:id', auth, async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query('SELECT * FROM todo WHERE id = ?', [id]);

        if (rows.length === 0)
            return res.status(404).json({ msg: 'Not found' });

        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

router.post('/', auth, async (req, res) => {
    if (!req.body)
        return res.status(400).json({ msg: 'Bad parameter' });
    const { title, description, due_time, user_id, status } = req.body;

    if (!title || !description || !due_time || !user_id || !status)
        return res.status(400).json({ msg: 'Bad parameter' });

    const allowedStatus = ['not started', 'todo', 'in progress', 'done'];
    if (!allowedStatus.includes(status))
        return res.status(400).json({ msg: 'Bad parameter' });

    try {
        const [user] = await pool.query('SELECT * FROM user WHERE id = ?', [user_id]);
        if (user.length === 0)
            return res.status(404).json({ msg: 'Not found' });

        const [result] = await pool.query(
            'INSERT INTO todo (title, description, due_time, user_id, status) VALUES (?, ?, ?, ?, ?)',
            [title, description, due_time, user_id, status]
        );

        const [created] = await pool.query('SELECT * FROM todo WHERE id = ?', [result.insertId]);
        res.status(201).json(created[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

router.put('/:id', auth, async (req, res) => {
    if (!req.body)
        return res.status(400).json({ msg: 'Bad parameter' });
    const { id } = req.params;
    const { title, description, due_time, user_id, status } = req.body;

    if (!title || !description || !due_time || !user_id || !status)
        return res.status(400).json({ msg: 'Bad parameter' });

    const allowedStatus = ['not started', 'todo', 'in progress', 'done'];
    if (!allowedStatus.includes(status))
        return res.status(400).json({ msg: 'Bad parameter' });

    try {
        const [check] = await pool.query('SELECT * FROM todo WHERE id = ?', [id]);
        if (check.length === 0)
            return res.status(404).json({ msg: 'Not found' });

        await pool.query(
            'UPDATE todo SET title = ?, description = ?, due_time = ?, user_id = ?, status = ? WHERE id = ?',
            [title, description, due_time, user_id, status, id]
        );

        const [updated] = await pool.query('SELECT * FROM todo WHERE id = ?', [id]);
        res.json(updated[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params;

    try {
        const [check] = await pool.query('SELECT * FROM todo WHERE id = ?', [id]);
        if (check.length === 0)
            return res.status(404).json({ msg: 'Not found' });

        await pool.query('DELETE FROM todo WHERE id = ?', [id]);
        res.json({ msg: `Successfully deleted record number: ${id}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

module.exports = router;
