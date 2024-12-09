import express from 'express';
import service from '../services/allTodo.services.js';

const router = express.Router();

// Update todo status by ID
router.put('/:id/:status', async (req, res, next) => {
    try {
        const { id, status } = req.params;  // Get the ID and status from the URL

        // Ensure the 'status' parameter is either 'completed' or 'not-completed'
        const completed = status === 'completed';  // Set 'completed' to true if 'completed', false otherwise

        const result = await service.updateStatus(id, completed);  // Call the service to update the status

        if (result) {
            res.status(200).json({
                todoId: id,
                message: 'Todo status updated successfully'
            });
        } else {
            res.status(404).json({
                error: 'Todo not found'
            });
        }
    } catch (error) {
        console.error("Error in updateStatus route:", error);
        next(error);  // Forward any error to the error handler middleware
    }
});


export default router;
