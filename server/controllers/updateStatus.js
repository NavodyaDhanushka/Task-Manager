import express from 'express';
import service from '../services/allTodo.services.js';

const router = express.Router();

// Update Tasks status by ID
router.put('/:id/:status', async (req, res, next) => {
    try {
        const { id, status } = req.params;

        const completed = status === 'completed';

        const result = await service.updateStatus(id, completed);

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
        next(error);
    }
});


export default router;
