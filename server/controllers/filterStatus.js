import express from 'express';
import service from '../services/allTodo.services.js';

const router = express.Router();

// Get todos by status
router.get('/', async (req, res, next) => {
    try {
        const { status } = req.query; // Get the status from query parameters
        const filteredTodos = await service.getTodosByStatus(status); // Call the service to fetch filtered todos
        res.status(200).json(filteredTodos); // Send the filtered todos as a response
    } catch (error) {
        next(error); // Forward any error to the error handler middleware
    }
});

export default router;
