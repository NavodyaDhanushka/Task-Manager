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

// Update a task by ID
const updateTodo = async (id, { name, description, completed }) => {

    if (!name || !description) {
        throw new Error('Todo name and description are required');
    }

    const query = "UPDATE todos SET name = ?, description = ?, completed = ? WHERE id = ?";
    const [result] = await db.query(query, [name, description, completed, id]);

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

// Update the status of a task by ID
const updateStatus = async (id, completed) => {
    try {
        const query = "UPDATE todos SET completed = ? WHERE id = ?";
        const [result] = await db.query(query, [completed, id]);

        if (result.affectedRows === 0) {
            return null;
        }

        return {
            todoId: id,
            message: 'Todo status updated successfully'
        };
    } catch (error) {
        console.error("Error in service:", error);
        throw error;
    }
};

// Fetch tasks by status
const getTodosByStatus = async (status) => {
    try {
        let query = 'SELECT * FROM todos';
        const queryParams = [];

        if (status === 'complete') {
            query += ' WHERE completed = true';
        } else if (status === 'incomplete') {
            query += ' WHERE completed = false';
        }

        const [todos] = await db.query(query, queryParams);
        return todos;
    } catch (error) {
        console.error('Error in getTodosByStatus service:', error);
        throw new Error('An error occurred while fetching todos.');
    }
};

export default {
    addTodo,
    getAllTodos,
    updateTodo,
    deleteTodo,
    updateStatus,
    getTodosByStatus
};
