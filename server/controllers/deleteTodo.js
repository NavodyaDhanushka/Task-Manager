import express from 'express';
import service from '../services/allTodo.services.js';

const router = express.Router();

// Delete a todo by ID
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params; // Get the todo ID from the URL
        await service.deleteTodo(id); // Call the service to delete the todo
        res.status(200).json({ message: `Todo with ID ${id} deleted successfully` }); // Send a success response
    } catch (error) {
        next(error); // Forward any error to the error handler middleware
    }
});

export default router;
