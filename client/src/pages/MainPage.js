import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';

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

    useEffect(() => {
        document.body.style.overflowY = "hidden";

        return () => {
            document.body.style.overflowY = "auto";
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

        const result = await Swal.fire({
            title: 'Are you sure?',
            //text: "You want to delete the event?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`http://localhost:8000/deletetodo/${todoToDelete.id}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    setTodos(todos.filter((_, i) => i !== index));

                    await Swal.fire(
                        'Deleted!',
                        'Your task has been deleted.',
                        'success'
                    );
                } else {
                    setErrorMessage("Failed to delete todo");
                }
            } catch (error) {
                setErrorMessage("Error: " + error.message);
            }
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

                    await Swal.fire({
                        title: 'Success!',
                        text: 'Task updated successfully',
                        icon: 'success',
                        confirmButtonColor: '#3085d6',
                    });
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
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col justify-center items-center p-6">
            <div className="bg-white shadow-xl rounded-2xl w-full max-w-screen-md p-8">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 text-center mb-8">
                    Task Manager
                </h1>

                {errorMessage && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
                        {errorMessage}
                    </div>
                )}

                <div className="flex flex-col space-y-4 mb-8">
                    <input
                        type="text"
                        value={addTaskName}
                        onChange={(e) => setAddTaskName(e.target.value)}
                        className="border border-gray-200 rounded-xl px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="Enter task name"
                    />
                    <textarea
                        value={addTaskDescription}
                        onChange={(e) => setAddTaskDescription(e.target.value)}
                        className="border border-gray-200 rounded-xl px-4 py-3 min-h-[100px] text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="Enter task description"
                    />
                    <button
                        onClick={addTodo}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all duration-200 font-semibold"
                    >
                        Add Task
                    </button>
                </div>

                {/* Filter Dropdown */}
                <div className="mb-6">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="border border-gray-200 rounded-xl px-4 py-2.5 w-full bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                        <option value="all">All Tasks</option>
                        <option value="complete">Completed Tasks</option>
                        <option value="incomplete">Pending Tasks</option>
                    </select>
                </div>

                <ul className="space-y-4 mb-6 overflow-y-auto max-h-[400px] pr-2">
                    {todos.map((todo, index) => (
                        <li key={index}
                            className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-all border border-gray-100">
                            <div className="flex-grow">
                                <div
                                    className={`font-semibold ${todo.completed ? "line-through text-gray-400" : "text-gray-800"}`}>
                                    {todo.name}
                                </div>
                                <div
                                    className={`text-sm mt-1 ${todo.completed ? "line-through text-gray-400" : "text-gray-600"}`}>
                                    {todo.description}
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 ml-4">
                                <button
                                    onClick={() => toggleComplete(index)}
                                    className={`${todo.completed ? "text-green-600 bg-green-50" : "text-gray-400 bg-gray-50"} p-2 rounded-lg transition-all duration-200 hover:opacity-80 flex items-center justify-center`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </button>
                                <button
                                    onClick={() => openEditModal(todo)}
                                    className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-all flex items-center justify-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/>
                                    </svg>
                                </button>
                                <button
                                    onClick={() => deleteTodo(index)}
                                    className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-all flex items-center justify-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
                                    </svg>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>


                {isEditModalOpen && (
                    <div
                        className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 backdrop-blur-sm">
                        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-screen-sm m-4">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Task</h2>

                            {editErrorMessage && (
                                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
                                    {editErrorMessage}
                                </div>
                            )}

                            <input
                                type="text"
                                value={editTaskName}
                                onChange={(e) => setEditTaskName(e.target.value)}
                                className="border border-gray-200 rounded-xl px-4 py-3 w-full mb-4 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="Edit task name"
                            />
                            <textarea
                                value={editTaskDescription}
                                onChange={(e) => setEditTaskDescription(e.target.value)}
                                className="border border-gray-200 rounded-xl px-4 py-3 w-full min-h-[100px] mb-6 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="Edit task description"
                            />
                            <div className="flex space-x-4">
                                <button
                                    onClick={updateTodo}
                                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all duration-200 font-semibold"
                                >
                                    Update Task
                                </button>
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all duration-200 font-semibold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MainPage;
