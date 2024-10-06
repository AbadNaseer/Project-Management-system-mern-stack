# Project Management System App

## Description
The **Project Management System App** is a RESTful API designed to facilitate project management tasks. Built with Node.js and Express, this application allows users to register, log in, create projects, assign tasks, and track task progress. The system utilizes JWT for secure authentication and stores data in JSON files for simplicity and ease of use.

## Features
- **User Registration**: Sign up with your name, email, designation, and password.
- **User Login**: Securely log in to access your account and manage projects.
- **Project Management**: Create and manage multiple projects with detailed descriptions.
- **Task Management**: Assign tasks to projects and track their statuses (e.g., Not Started, In Progress, Completed).
- **JWT Authentication**: Protect API endpoints with JWT tokens for secure access.

## Technologies Used
- **Node.js**: JavaScript runtime for building server-side applications.
- **Express**: Web application framework for Node.js.
- **JWT**: JSON Web Tokens for secure user authentication.
- **bcryptjs**: Library for hashing passwords.
- **Supertest**: Testing library for HTTP assertions.
- **jsonfile**: Library for reading/writing JSON files.
- **Postman**: Tool for testing API endpoints.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/AbadNaseer/Project-Management-system-mern-stack.git
   cd Project-Management-system-mern-stack



2. npm 



## Create a users.json file in the project root directory to store user data:

[]

## Create a projects.json file in the project root directory to store project data:
[]

## How to Run
Start the server:
bash

 1.   npm start

    The server will run on http://localhost:3000 by default.

    Use tools like Postman or curl to interact with the API endpoints.

## API Endpoints
1. User Registration

    POST /register
        Request Body:

        {
          "name": "John Doe",
          "designation": "Developer",
          "email": "john.doe@example.com",
          "password": "securepassword"
        }

        Response:
            Status: 200 OK
            Message: User registered successfully

2. User Login

    POST /login
        Request Body:

        {
          "email": "john.doe@example.com",
          "password": "securepassword"
        }

        Response:
            Status: 200 OK
            Token: JWT token for authentication

3. Create a New Project

    POST /projects
        Headers: Authorization: Bearer <token>
        Request Body:

        json

        {
          "projectName": "New Project",
          "description": "Detailed description of the project.",
          "completionTime": "2024-12-31"
        }

        Response:
            Status: 200 OK
            Message: Project created successfully
            Project Object: Contains details of the created project.

4. Assign a Task to a Project

    POST /projects/:projectId/tasks
        Headers: Authorization: Bearer <token>
        Request Body:

        {
          "taskTitle": "New Task",
          "description": "Description of the task.",
          "dueDate": "2024-10-10",
          "assignedTo": "john.doe@example.com"
        }

        Response:
            Status: 200 OK
            Message: Task assigned successfully
            Task Object: Contains details of the assigned task.

5. Update Task Status

    PATCH /projects/:projectId/tasks/:taskId
        Headers: Authorization: Bearer <token>
        Request Body:

        {
          "status": "In Progress"
        }

        Response:
            Status: 200 OK
            Message: Task status updated
            Task Object: Contains updated task details.

## Testing

To run the tests, use the following command:

```bash

1. npm test

This will execute all unit tests for the API, ensuring all functionalities are working as expected.
GitHub Actions

This project is configured to use GitHub Actions for continuous integration. Whenever you push changes to the repository, the workflow will automatically run tests to ensure the integrity of the code.
## Contributing

Contributions are welcome! Please fork the repository, make your changes, and create a pull request. Ensure that your code adheres to the existing style and includes tests for new features.
License

This project is licensed under the MIT License - see the LICENSE file for details.
Author: 

Abad Naseer
abad.naseerfast@gmail.com
