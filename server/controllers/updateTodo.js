import express from 'express';
import service from '../services/allTodo.services.js';

const router = express.Router();

// Update a todo by ID
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params; // Get the todo ID from the URL
        const { name, description, completed } = req.body; // Get the updated todo data from the request body

        const updatedTodo = await service.updateTodo(id, { name, description, completed }); // Call the service to update the todo
        res.status(200).json(updatedTodo); // Send the updated todo as a response
    } catch (error) {
        next(error); // Forward any error to the error handler middleware
    }
});

export default router;
