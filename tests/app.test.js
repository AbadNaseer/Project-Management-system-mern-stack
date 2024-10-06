const request = require('supertest');
const app = require('../index'); // Import the app for testing

describe('API Endpoints', () => {
    let token;

    // Register a user before tests
    beforeAll(async () => {
        await request(app)
            .post('/register')
            .send({
                name: 'Test User',
                designation: 'Developer',
                email: 'testuser@example.com',
                password: 'testpassword123'
            });
    });

    // Test User Registration
    it('should register a new user', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                name: 'John Doe',
                designation: 'Manager',
                email: 'john@example.com',
                password: 'password123'
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User registered successfully');
    });

    // Test Duplicate Registration
    it('should not allow duplicate registration', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                name: 'John Doe',
                designation: 'Manager',
                email: 'john@example.com',
                password: 'password123'
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('User already exists');
    });

    // Test User Login
    it('should login an existing user and return a token', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                email: 'testuser@example.com',
                password: 'testpassword123'
            });

        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();

        token = response.body.token; // Save the token for authenticated requests
    });

    // Test Invalid Login
    it('should not login with invalid credentials', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                email: 'testuser@example.com',
                password: 'wrongpassword'
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid password');
    });

    // Test Project Creation
    it('should create a new project', async () => {
        const response = await request(app)
            .post('/projects')
            .set('Authorization', `Bearer ${token}`)
            .send({
                projectName: 'New Project',
                description: 'Project description',
                completionTime: '2024-12-01'
            });

        expect(response.status).toBe(200);
        expect(response.body.project.projectName).toBe('New Project');
    });

    // Test Task Assignment
    it('should assign a task to a project', async () => {
        const response = await request(app)
            .post('/projects/1/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({
                taskTitle: 'New Task',
                description: 'Task description',
                dueDate: '2024-11-01',
                assignedTo: 'Jane Doe'
            });

        expect(response.status).toBe(200);
        expect(response.body.task.taskTitle).toBe('New Task');
    });

    // Test Task Progress Update
    it('should update task status', async () => {
        const response = await request(app)
            .patch('/projects/1/tasks/1')
            .set('Authorization', `Bearer ${token}`)
            .send({
                status: 'In Progress'
            });

        expect(response.status).toBe(200);
        expect(response.body.task.status).toBe('In Progress');
    });
});
