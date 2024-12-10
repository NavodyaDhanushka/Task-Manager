import express from 'express';
import service from '../services/allTodo.services.js';

const router = express.Router();

// Get all Tasks
router.get('/', async (req, res, next) => {
    try {
        const tasks = await service.getAllTodos();
        res.send(tasks);
    } catch (error) {
        next(error);
    }
});


export default router;
