const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all tasks
router.get('/tasks', (req, res) => {
    db.query('SELECT * FROM tasks', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Add a new task
router.post('/tasks', (req, res) => {
    const { task } = req.body;
    db.query('INSERT INTO tasks (task) VALUES (?)', [task], (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ id: results.insertId, task });
    });
});

// Delete a task
router.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM tasks WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Task deleted' });
    });
});

module.exports = router;
