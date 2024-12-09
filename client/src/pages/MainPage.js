import React, { useState, useEffect } from "react";

export default function MainPage() {
    const [todos, setTodos] = useState([]);
    const [addTaskName, setAddTaskName] = useState(""); // Separate state for add task form
    const [addTaskDescription, setAddTaskDescription] = useState(""); // Separate state for add task form
    const [editTaskName, setEditTaskName] = useState(""); // Separate state for edit task form
    const [editTaskDescription, setEditTaskDescription] = useState(""); // Separate state for edit task form
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentTodoId, setCurrentTodoId] = useState(null);

    // Fetch all todos from the database when the component mounts
    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const response = await fetch("http://localhost:8000/alltodos");
                if (response.ok) {
                    const data = await response.json();
                    setTodos(data); // Set the todos to state
                } else {
                    console.error("Failed to fetch todos");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchTodos(); // Call fetchTodos when the component mounts
    }, []);

    const addTodo = async () => {
        if (addTaskName.trim() && addTaskDescription.trim()) {
            const newTodo = { name: addTaskName, description: addTaskDescription, completed: false };

            try {
                // Save the new todo in the database
                const response = await fetch("http://localhost:8000/todos", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newTodo),
                });

                if (response.ok) {
                    const savedTodo = await response.json();
                    setTodos([...todos, savedTodo]); // Add the saved todo to the list
                    setAddTaskName(""); // Clear add task input fields
                    setAddTaskDescription(""); // Clear add task input fields
                } else {
                    console.error("Failed to save todo");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }
    };

    const toggleComplete = async (index) => {
        const updatedTodos = [...todos];
        const todo = updatedTodos[index];

        // Toggle the 'completed' status
        todo.completed = !todo.completed;

        try {
            const status = todo.completed ? 'completed' : 'not-completed';

            const response = await fetch(`http://localhost:8000/updateStatus/${todo.id}/${status}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ completed: todo.completed }),
            });

            if (response.ok) {
                setTodos(updatedTodos);
            } else {
                console.error("Failed to update todo");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const deleteTodo = async (index) => {
        const todoToDelete = todos[index];

        try {
            const response = await fetch(`http://localhost:8000/deletetodo/${todoToDelete.id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setTodos(todos.filter((_, i) => i !== index));
            } else {
                console.error("Failed to delete todo");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const openEditModal = (todo) => {
        setCurrentTodoId(todo.id);
        setEditTaskName(todo.name); // Set values for edit modal
        setEditTaskDescription(todo.description); // Set values for edit modal
        setIsEditModalOpen(true);
    };

    const updateTodo = async () => {
        if (editTaskName.trim() && editTaskDescription.trim()) {
            const updatedTodo = { name: editTaskName, description: editTaskDescription, completed: false };

            try {
                const response = await fetch(`http://localhost:8000/updatetodo/${currentTodoId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedTodo),
                });

                if (response.ok) {
                    const updatedTodos = todos.map((todo) =>
                        todo.id === currentTodoId ? { ...todo, name: editTaskName, description: editTaskDescription } : todo
                    );
                    setTodos(updatedTodos);
                    setIsEditModalOpen(false);
                } else {
                    console.error("Failed to update todo");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center items-center">
            <div className="bg-white shadow-lg rounded-lg p-6 w-96">
                <h1 className="text-2xl font-bold text-purple-600 text-center mb-4">Task Manager</h1>
                <div className="flex flex-col space-y-2 mb-4">
                    <input
                        type="text"
                        value={addTaskName}
                        onChange={(e) => setAddTaskName(e.target.value)}
                        className="border rounded-lg px-4 py-2 text-black"
                        placeholder="Enter task name"
                    />
                    <textarea
                        value={addTaskDescription}
                        onChange={(e) => setAddTaskDescription(e.target.value)}
                        className="border rounded-lg px-4 py-2 text-black"
                        placeholder="Enter task description"
                    />
                    <button
                        onClick={addTodo}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                    >
                        Add Task
                    </button>
                </div>

                <ul>
                    {todos.map((todo, index) => (
                        <li key={index} className="flex items-center justify-between border-b py-2">
                            <div className="flex-grow">
                                <div className={`text-black font-bold ${todo.completed ? "line-through text-gray-400" : ""}`}>
                                    {todo.name}
                                </div>
                                <div className={`text-black text-sm ${todo.completed ? "line-through text-gray-400" : ""}`}>
                                    {todo.description}
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => toggleComplete(index)}
                                    className={`${todo.completed ? "bg-purple-600" : "bg-gray-300"} w-6 h-6 rounded-full`}
                                />
                                <button
                                    onClick={() => openEditModal(todo)}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={() => deleteTodo(index)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    🗑
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>

                {isEditModalOpen && (
                    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <h2 className="text-xl font-semibold mb-4">Edit Todo</h2>
                            <input
                                type="text"
                                value={editTaskName}
                                onChange={(e) => setEditTaskName(e.target.value)}
                                className="border rounded-lg px-4 py-2 text-black mb-4 w-full"
                                placeholder="Enter todo name"
                            />
                            <textarea
                                value={editTaskDescription}
                                onChange={(e) => setEditTaskDescription(e.target.value)}
                                className="border rounded-lg px-4 py-2 text-black mb-4 w-full"
                                placeholder="Enter todo description"
                            />
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="bg-gray-300 text-black px-4 py-2 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={updateTodo}
                                    className="bg-purple-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
