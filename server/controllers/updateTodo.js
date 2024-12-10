import express from 'express';
import service from '../services/allTodo.services.js';

const router = express.Router();

// Update a Tasks by ID
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description, completed } = req.body;

        const updatedTask = await service.updateTodo(id, { name, description, completed });
        res.status(200).json(updatedTask);
    } catch (error) {
        next(error);
    }
});

export default router;
