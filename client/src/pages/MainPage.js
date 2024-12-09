import React, { useState, useEffect } from "react";

export default function MainPage() {
    const [todos, setTodos] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

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
        if (name.trim() && description.trim()) {
            const newTodo = { name, description, completed: false };

            try {
                // Save the new todo in the database
                const response = await fetch("http://localhost:8000/todos", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newTodo),
                });
                console.log(response);

                if (response.ok) {
                    const savedTodo = await response.json();
                    setTodos([...todos, savedTodo]); // Add the saved todo to the list
                    setName("");
                    setDescription("");
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
        updatedTodos[index].completed = !updatedTodos[index].completed;

        try {
            const response = await fetch(`http://localhost:5000/todos/${updatedTodos[index].id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedTodos[index]),
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
            const response = await fetch(`http://localhost:5000/todos/${todoToDelete.id}`, {
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

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center items-center">
            <div className="bg-white shadow-lg rounded-lg p-6 w-96">
                <h1 className="text-2xl font-bold text-purple-600 text-center mb-4">
                    Todo App
                </h1>
                <div className="flex flex-col space-y-2 mb-4">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border rounded-lg px-4 py-2 text-black"
                        placeholder="Enter todo name"
                    />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border rounded-lg px-4 py-2 text-black"
                        placeholder="Enter todo description"
                    />
                    <button
                        onClick={addTodo}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                    >
                        Add Todo
                    </button>
                </div>
                <ul>
                    {todos.map((todo, index) => (
                        <li
                            key={index}
                            className="flex items-center justify-between border-b py-2"
                        >
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
                                    className={`${
                                        todo.completed ? "bg-purple-600" : "bg-gray-300"
                                    } w-6 h-6 rounded-full`}
                                />
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
            </div>
        </div>
    );
}
