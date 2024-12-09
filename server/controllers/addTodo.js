import express from 'express';
import service from '../services/allTodo.services.js';

const router = express.Router();

// Add a new
router.post('/', async (req, res, next) => {
    try {
        const { name, description, completed } = req.body;

        // Validate required fields
        if (!name || !description) {
            return res.status(400).json({ error: 'Name and description are required' });
        }

        const newTodo = await service.addTodo({ name, description, completed });
        res.status(201).json(newTodo);
    } catch (error) {
        next(error); // Forward the error to the error handling middleware
    }
});

export default router;
