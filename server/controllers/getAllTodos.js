import express from 'express';
import service from '../services/allTodo.services.js';

const router = express.Router();

// Get all todos
router.get('/', async (req, res, next) => {
    try {
        const todos = await service.getAllTodos(); // Call the service method
        res.send(todos); // Send the todos as a response
    } catch (error) {
        next(error); // Forward any errors to the error-handling middleware
    }
});


export default router;
