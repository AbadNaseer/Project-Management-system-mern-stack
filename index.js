const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const jsonfile = require('jsonfile');
const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory storage using jsonfile
const userDataFile = './users.json';
const projectDataFile = './projects.json';

// Helper function to save data to JSON files
const saveDataToFile = (filePath, data) => {
    jsonfile.writeFileSync(filePath, data, { spaces: 2 });
};

// Initial data
let users = jsonfile.readFileSync(userDataFile, { throws: false }) || [];
let projects = jsonfile.readFileSync(projectDataFile, { throws: false }) || [];

// JWT secret key
const secretKey = 'mysecretkey';

// Middleware to check for authentication token
const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ message: 'Access Denied' });

    // Extract the token from the Bearer <token> format
    const token = authHeader.split(' ')[1];  // authHeader is expected to be 'Bearer <token>'
    if (!token) return res.status(401).json({ message: 'Access Denied' });

    try {
        const verified = jwt.verify(token, secretKey);
        req.user = verified;  // Add user info from the token to the request object
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};


// User Registration
app.post('/register', async (req, res) => {
    const { name, designation, email, password } = req.body;

    // Check if user exists
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password and save user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = { id: users.length + 1, name, designation, email, password: hashedPassword };
    users.push(newUser);
    saveDataToFile(userDataFile, users);
    
    res.json({ message: 'User registered successfully' });
});

// User Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = users.find((user) => user.email === email);
    if (!user) return res.status(400).json({ message: 'User not found' });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ message: 'Invalid password' });

    // Create and assign JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
    res.json({ token });
});

// Project Creation
app.post('/projects', authenticateToken, (req, res) => {
    const { projectName, description, completionTime } = req.body;

    const newProject = {
        id: projects.length + 1,
        projectName,
        description,
        completionTime,
        createdBy: req.user.email,
        tasks: []
    };

    projects.push(newProject);
    saveDataToFile(projectDataFile, projects);
    
    res.json({ message: 'Project created successfully', project: newProject });
});

// Task Assignment
app.post('/projects/:projectId/tasks', authenticateToken, (req, res) => {
    const { taskTitle, description, dueDate, assignedTo } = req.body;
    const projectId = parseInt(req.params.projectId);

    const project = projects.find((proj) => proj.id === projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const newTask = {
        id: project.tasks.length + 1,
        taskTitle,
        description,
        dueDate,
        assignedTo,
        status: 'Not Started'
    };

    project.tasks.push(newTask);
    saveDataToFile(projectDataFile, projects);
    
    res.json({ message: 'Task assigned successfully', task: newTask });
});

// Task Progress Tracking
app.patch('/projects/:projectId/tasks/:taskId', authenticateToken, (req, res) => {
    const { status } = req.body;
    const projectId = parseInt(req.params.projectId);
    const taskId = parseInt(req.params.taskId);

    const project = projects.find((proj) => proj.id === projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const task = project.tasks.find((t) => t.id === taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.status = status;
    saveDataToFile(projectDataFile, projects);
    
    res.json({ message: 'Task status updated', task });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
