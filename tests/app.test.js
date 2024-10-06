const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const jsonfile = require('jsonfile');
const app = require('../index'); 
const userDataFile = './users.json';

// Helper function to reset users data
const resetUsersData = () => {
    jsonfile.writeFileSync(userDataFile, [], { spaces: 2 });
};

describe('API Endpoints', () => {
    // Before each test, reset the users data
    beforeEach(() => {
        resetUsersData();
    });

    it('should register a new user', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                name: 'John Doe',
                designation: 'Developer',
                email: 'john.doe@example.com',
                password: 'securepassword'
            });

        // Log response body for debugging
        console.log(response.body);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User registered successfully');
    });

    it('should not allow duplicate registration', async () => {
        await request(app)
            .post('/register')
            .send({
                name: 'Jane Doe',
                designation: 'Designer',
                email: 'jane.doe@example.com',
                password: 'securepassword'
            });

        const response = await request(app)
            .post('/register')
            .send({
                name: 'Jane Doe',
                designation: 'Designer',
                email: 'jane.doe@example.com',
                password: 'securepassword'
            });

        // Log response body for debugging
        console.log(response.body);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('User already exists');
    });

    it('should login an existing user and return a token', async () => {
        await request(app)
            .post('/register')
            .send({
                name: 'Alice Smith',
                designation: 'Manager',
                email: 'alice.smith@example.com',
                password: 'securepassword'
            });

        const response = await request(app)
            .post('/login')
            .send({
                email: 'alice.smith@example.com',
                password: 'securepassword'
            });

        // Log response body for debugging
        console.log(response.body);

        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
    });

    it('should not login with invalid credentials', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                email: 'nonexistent@example.com',
                password: 'wrongpassword'
            });

        // Log response body for debugging
        console.log(response.body);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('User not found');
    });

    it('should create a new project', async () => {
        // First, register a user to create a project
        await request(app)
            .post('/register')
            .send({
                name: 'Bob Brown',
                designation: 'Developer',
                email: 'bob.brown@example.com',
                password: 'securepassword'
            });

        // Now login to get the token
        const loginResponse = await request(app)
            .post('/login')
            .send({
                email: 'bob.brown@example.com',
                password: 'securepassword'
            });

        const token = loginResponse.body.token;

        const response = await request(app)
            .post('/projects')
            .set('Authorization', `Bearer ${token}`)
            .send({
                projectName: 'New Project',
                description: 'Project description here',
                completionTime: '2024-12-31'
            });

        // Log response body for debugging
        console.log(response.body);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Project created successfully');
    });

    it('should assign a task to a project', async () => {
        // First, register and login a user to create a project
        const userResponse = await request(app)
            .post('/register')
            .send({
                name: 'Charlie Black',
                designation: 'Developer',
                email: 'charlie.black@example.com',
                password: 'securepassword'
            });

        const loginResponse = await request(app)
            .post('/login')
            .send({
                email: 'charlie.black@example.com',
                password: 'securepassword'
            });

        const token = loginResponse.body.token;

        // Create a new project
        const projectResponse = await request(app)
            .post('/projects')
            .set('Authorization', `Bearer ${token}`)
            .send({
                projectName: 'Task Assignment Project',
                description: 'Description of the project',
                completionTime: '2024-12-31'
            });

        const projectId = projectResponse.body.project.id;

        const taskResponse = await request(app)
            .post(`/projects/${projectId}/tasks`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                taskTitle: 'New Task',
                description: 'Task description',
                dueDate: '2024-10-10',
                assignedTo: 'charlie.black@example.com'
            });

        // Log response body for debugging
        console.log(taskResponse.body);

        expect(taskResponse.status).toBe(200);
        expect(taskResponse.body.message).toBe('Task assigned successfully');
    });

    it('should update task status', async () => {
        // First, register and login a user to create a project and assign a task
        const userResponse = await request(app)
            .post('/register')
            .send({
                name: 'Diana White',
                designation: 'Developer',
                email: 'diana.white@example.com',
                password: 'securepassword'
            });

        const loginResponse = await request(app)
            .post('/login')
            .send({
                email: 'diana.white@example.com',
                password: 'securepassword'
            });

        const token = loginResponse.body.token;

        // Create a new project
        const projectResponse = await request(app)
            .post('/projects')
            .set('Authorization', `Bearer ${token}`)
            .send({
                projectName: 'Update Status Project',
                description: 'Description of the project',
                completionTime: '2024-12-31'
            });

        const projectId = projectResponse.body.project.id;

        // Assign a task
        const taskResponse = await request(app)
            .post(`/projects/${projectId}/tasks`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                taskTitle: 'Task to Update',
                description: 'Task description',
                dueDate: '2024-10-10',
                assignedTo: 'diana.white@example.com'
            });

        const taskId = taskResponse.body.task.id;

        // Update task status
        const updateResponse = await request(app)
            .patch(`/projects/${projectId}/tasks/${taskId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                status: 'In Progress'
            });

        // Log response body for debugging
        console.log(updateResponse.body);

        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body.message).toBe('Task status updated');
    });
});
