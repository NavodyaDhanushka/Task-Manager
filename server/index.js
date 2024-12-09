import express from 'express';
import db from './db.js';
import cors from 'cors';

import addTodo from './controllers/addTodo.js'; // Ensure the path is correct
import getAllTodos from "./controllers/getAllTodos.js";
import updateTodo from "./controllers/updateTodo.js"; // Import the database connection
import deleteTodo from "./controllers/deleteTodo.js"
import updateStatus from "./controllers/updateStatus.js";
import filterStatus from "./controllers/filterStatus.js";

const app = express();
app.use(express.json());

app.use(cors());
app.options('*', cors());

// Test the database connection
db.getConnection()
    .then(() => {
        console.log('DB connection succeeded.');
    })
    .catch(err => {
        console.error('DB connection failed.\n', err);
        process.exit(1); // Exit the process if the DB connection fails
    });

// Use the todos router for all /todos routes
app.use('/todos', addTodo)
app.use('/alltodos',getAllTodos)
app.use('/updatetodo',updateTodo)
app.use('/deletetodo',deleteTodo)
app.use('/updateStatus',updateStatus)
app.use('/filterStatus',filterStatus)


// Handle invalid routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Handle server errors
/*app.use((err, req, res, next) => {
    console.error('Internal Server Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});*/

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
