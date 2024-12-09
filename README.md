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

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Add a new task

```http
  POST /todos
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `name`      | `string` | **Required**. Name of the task |
| `description`      | `string` | **Required**. Description of task |
| `completed`      | `boolean` | **Required**. Status of the task (default is false or incompleted) |


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



