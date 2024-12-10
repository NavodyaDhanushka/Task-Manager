import express from 'express';
import service from '../services/allTodo.services.js';

const router = express.Router();

// Add a new Task
router.post('/', async (req, res, next) => {
    try {
        const { name, description, completed } = req.body;
        if (!name || !description) {
            return res.status(400).json({ error: 'Name and description are required' });
        }
        const newTasks = await service.addTodo({ name, description, completed });
        res.status(201).json(newTasks);
    } catch (error) {
        next(error);
    }
});

export default router;
