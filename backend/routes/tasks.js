// taskRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Route for getting all tasks
router.get('/tasks', (req, res) => {
    db.query('SELECT id, task, task_status FROM tasks', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
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

// Route for adding a new task
router.post('/tasks', (req, res) => {
    const { task } = req.body;
    db.query('INSERT INTO tasks (task, task_status) VALUES (?, ?)', [task, 'to-do'], (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ id: results.insertId, task, task_status: 'to-do' });
    });
});

// Route for updating task status
router.patch('/tasks/toggle-status/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Validate the status value
    if (!['to-do', 'processing', 'done'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
    }

    // Update the task status in the database
    db.query('UPDATE tasks SET task_status = ? WHERE id = ?', [status, id], (err, results) => {
        if (err) {
            console.error('Error updating task status:', err);
            return res.status(500).send(err);
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task status updated', status: status });
    });
});

module.exports = router;
