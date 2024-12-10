import express from 'express';
import service from '../services/allTodo.services.js';

const router = express.Router();

// Get Tasks by status
router.get('/', async (req, res, next) => {
    try {
        const { status } = req.query;
        const filteredTasks = await service.getTodosByStatus(status);
        res.status(200).json(filteredTasks);
    } catch (error) {
        next(error);
    }
});

export default router;
