import db from '../db.js';

const addTodo = async ({ name, description, completed = false }) => {
    if (!name || !description) {
        throw new Error('Todo name and description are required');
    }

    const query = "INSERT INTO todos (name, description, completed) VALUES (?, ?, ?)";
    const [result] = await db.query(query, [name, description, completed]);

    return {
        todoId: result.insertId,
        message: 'Todo added successfully'
    };
};

const getAllTodos = async () => {
    const query = "SELECT * FROM todos";
    const [todos] = await db.query(query);
    return todos;
};

// Update a todo by ID
const updateTodo = async (id, { name, description, completed }) => {
    // Validate that the required fields are present
    if (!name || !description) {
        throw new Error('Todo name and description are required');
    }

    // Query to update the todo in the database
    const query = "UPDATE todos SET name = ?, description = ?, completed = ? WHERE id = ?";
    const [result] = await db.query(query, [name, description, completed, id]);

    // If no rows were affected, throw an error
    if (result.affectedRows === 0) {
        throw new Error('Todo not found');
    }

    return {
        todoId: id,
        message: 'Todo updated successfully'
    };
};

const deleteTodo = async (id) => {
    if (!id) {
        throw new Error('Todo ID is required for deletion');
    }

    const query = "DELETE FROM todos WHERE id = ?";
    const [result] = await db.query(query, [id]);

    if (result.affectedRows === 0) {
        throw new Error(`Todo with ID ${id} not found`);
    }
};

// Update the status of a todo by ID
const updateStatus = async (id, completed) => {
    try {
        // Query to update only the 'completed' status in the database
        const query = "UPDATE todos SET completed = ? WHERE id = ?";
        const [result] = await db.query(query, [completed, id]);

        // If no rows were affected, throw an error
        if (result.affectedRows === 0) {
            return null;  // Return null if the todo isn't found
        }

        return {
            todoId: id,
            message: 'Todo status updated successfully'
        };
    } catch (error) {
        console.error("Error in service:", error);
        throw error;  // Propagate error to the controller
    }
};

export default {
    addTodo,
    getAllTodos,
    updateTodo,
    deleteTodo,
    updateStatus
};
