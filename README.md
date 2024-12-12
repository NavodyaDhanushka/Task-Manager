# Task Manager Application

The Task Manager Application is a project that allows users to manage and organize their tasks effectively. Built with React, this application provides a simple yet powerful interface to add, update, toggle completion status, and delete tasks. It integrates with a backend API to store and retrieve task data in real time.

The application allows users to:

Add new tasks with a title and description.
Edit tasks by updating their title or description.
Toggle task completion status, visually indicating whether a task is completed or pending.
Delete tasks that are no longer needed.
View all tasks in an organized list, with real-time updates from the backend.
The backend communicates with a database to persist the task data, and each task includes a status to track whether it has been completed. The app leverages modern React hooks and state management to ensure a smooth user experience, while the backend API is responsible for handling database interactions securely.

Key features of this project:

Task Creation: Add new tasks with a title and description.
Task Editing: Modify task details using a modal interface.
Completion Toggle: Mark tasks as complete or incomplete with a simple click.
Task Deletion: Easily remove tasks when they are no longer required.
Real-Time Updates: Tasks are updated dynamically across the application.
The Task Manager is designed to be user-friendly, flexible, and efficient for organizing both personal and professional tasks.


## API Reference

#### Get all tasks

```http
  GET /alltodos
```

| Parameter | Type | Description |
|:----------|:-----|:------------|
|           |      |             |

#### Add a new task

```http
  POST /todos
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `name`      | `string` | **Required**. Name of the task |
| `description`      | `string` | **Required**. Description of task |
| `completed`      | `boolean` | **Required**. Status of the task (default is false) |


#### Update a task

```http
  PUT /todos
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. ID of the task to update (Note: ID cannot be updated) |
| `name`      | `string` | **Required**. Updated name of the task |
| `description`      | `string` | **Required**.  Updated description of the task |
| `completed`      | `boolean` | **Required**. Updated status of the task |

#### Delete a task

```http
  DELETE /deletetodo/${id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. ID of the task to delete |

#### Toggle task completion

```http
  PUT /updateStatus/${id}/toggle-complete
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. ID of the task to toggle completion |

#### Filter tasks by status

```http
   GET /filterStatus?status=${status}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `status` | `string` | **Required**. Status to filter tasks by (e.g., completed, pending) |


## Installation and Setup

Follow these steps to set up and run the application locally

1. Clone the Repository
```bash

git clone https://github.com/NavodyaDhanushka/Task-Manager.git
```
2. Create and Configure the Database
   Open MySQL Workbench, and execute the following SQL commands to create and configure the database
```bash

CREATE DATABASE todo_db;

USE todo_db;

CREATE TABLE todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT false
);
```
Update the db.js file in the project to include your MySQL username and password.

3. Install Dependencies
   Navigate to the client directory
```bash

cd ./client
```
Install the necessary dependencies
```bash

npm i
```
Repeat the above steps for the server directory.

4. Run the Application

Start the application using the provided scripts in the client and server directories.
Usage
Once the setup is complete, you can use the application to manage your tasks efficiently.

Navigate to the client directory in your terminal and run
```bash

npm start
```
Similarly, start the server by navigating to the server directory and running
```bash

npm start
```
5.
Open your browser and access the application at http://localhost:3000.

    

