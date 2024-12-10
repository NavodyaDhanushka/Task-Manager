import express from 'express';
import service from '../services/allTodo.services.js';

const router = express.Router();

// Delete a Task by ID
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        await service.deleteTodo(id);
        res.status(200).json({ message: `Todo with ID ${id} deleted successfully` });
    } catch (error) {
        next(error);
    }
});

export default router;
