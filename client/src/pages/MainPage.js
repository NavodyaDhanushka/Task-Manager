import React, { useState, useEffect } from "react";

const MainPage = () => {
    const [todos, setTodos] = useState([]);
    const [addTaskName, setAddTaskName] = useState("");
    const [addTaskDescription, setAddTaskDescription] = useState("");
    const [editTaskName, setEditTaskName] = useState("");
    const [editTaskDescription, setEditTaskDescription] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentTodoId, setCurrentTodoId] = useState(null);
    const [filter, setFilter] = useState("all");
    const [errorMessage, setErrorMessage] = useState("");
    const [editErrorMessage, setEditErrorMessage] = useState("");

    // Lock page overflow on component mount
    useEffect(() => {
        document.body.style.overflowY = "hidden";  // Lock the page scroll

        // Clean up on component unmount
        return () => {
            document.body.style.overflowY = "auto";  // Re-enable page scroll
        };
    }, []);

    const fetchTodos = async (filter) => {
        try {
            const url = filter === "all"
                ? "http://localhost:8000/alltodos"
                : `http://localhost:8000/filterStatus?status=${filter}`;
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                setTodos(data);
            } else {
                setErrorMessage("Failed to fetch todos");
            }
        } catch (error) {
            setErrorMessage("Error: " + error.message);
        }
    };

    useEffect(() => {
        fetchTodos(filter);
    }, [filter]);

    const addTodo = async () => {
        if (addTaskName.trim() && addTaskDescription.trim()) {
            const newTodo = { name: addTaskName, description: addTaskDescription, completed: false };

            try {
                const response = await fetch("http://localhost:8000/todos", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newTodo),
                });

                if (response.ok) {
                    setAddTaskName("");
                    setAddTaskDescription("");
                    await fetchTodos(filter);
                    setErrorMessage("");
                } else {
                    setErrorMessage("Failed to save todo");
                }
            } catch (error) {
                setErrorMessage("Error: " + error.message);
            }
        } else {
            setErrorMessage("Task name and description cannot be empty");
        }
    };

    const toggleComplete = async (index) => {
        const updatedTodos = [...todos];
        const todo = updatedTodos[index];
        todo.completed = !todo.completed;

        try {
            const status = todo.completed ? "completed" : "not-completed";
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
                setErrorMessage("Failed to update todo status");
            }
        } catch (error) {
            setErrorMessage("Error: " + error.message);
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
                setErrorMessage("Failed to delete todo");
            }
        } catch (error) {
            setErrorMessage("Error: " + error.message);
        }
    };

    const openEditModal = (todo) => {
        setCurrentTodoId(todo.id);
        setEditTaskName(todo.name);
        setEditTaskDescription(todo.description);
        setIsEditModalOpen(true);
        setEditErrorMessage("");
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
                    setEditErrorMessage("");
                } else {
                    setEditErrorMessage("Failed to update todo");
                }
            } catch (error) {
                setEditErrorMessage("Error: " + error.message);
            }
        } else {
            setEditErrorMessage("Task name and description cannot be empty");
        }
    };

    return (
        <div className="min-h-screen w-screen bg-gray-50 flex flex-col justify-center items-center">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-screen-md">
                <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">Task Manager</h1>

                {/* Filter Dropdown */}
                <div className="mb-4">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="border rounded-lg px-4 py-2 text-black w-full"
                    >
                        <option value="all">All</option>
                        <option value="complete">Completed</option>
                        <option value="incomplete">Incomplete</option>
                    </select>
                </div>

                {/* Error Message */}
                {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

                <div className="flex flex-col space-y-4 mb-6">
                    <input
                        type="text"
                        value={addTaskName}
                        onChange={(e) => setAddTaskName(e.target.value)}
                        className="border rounded-lg px-4 py-2 text-black w-full"
                        placeholder="Enter task name"
                    />
                    <textarea
                        value={addTaskDescription}
                        onChange={(e) => setAddTaskDescription(e.target.value)}
                        className="border rounded-lg px-4 py-2 text-black w-full"
                        placeholder="Enter task description"
                    />
                    <button
                        onClick={addTodo}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Add Task
                    </button>
                </div>

                <ul className="space-y-4 mb-6 overflow-y-auto max-h-96">
                    {todos.map((todo, index) => (
                        <li key={index} className="flex items-center justify-between border-b pb-2">
                            <div className="flex-grow">
                                <div
                                    className={`text-black font-bold ${todo.completed ? "line-through text-gray-400" : ""}`}>
                                    {todo.name}
                                </div>
                                <div
                                    className={`text-black text-sm ${todo.completed ? "line-through text-gray-400" : ""}`}>
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
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-screen-sm">
                            <h2 className="text-xl font-semibold mb-4">Edit Todo</h2>

                            {/* Edit Error Message */}
                            {editErrorMessage && <div className="text-red-500 mb-4">{editErrorMessage}</div>}

                            <input
                                type="text"
                                value={editTaskName}
                                onChange={(e) => setEditTaskName(e.target.value)}
                                className="border rounded-lg px-4 py-2 text-black w-full"
                                placeholder="Edit task name"
                            />
                            <textarea
                                value={editTaskDescription}
                                onChange={(e) => setEditTaskDescription(e.target.value)}
                                className="border rounded-lg px-4 py-2 text-black w-full"
                                placeholder="Edit task description"
                            />
                            <button
                                onClick={updateTodo}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 mt-4"
                            >
                                Update Task
                            </button>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="text-red-600 hover:text-red-800 mt-4"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MainPage;
