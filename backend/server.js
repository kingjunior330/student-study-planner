const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// SIMPLE TEST ROUTES - NO DATABASE NEEDED FOR BASIC TEST
app.get('/', (req, res) => {
    res.json({ 
        status: 'ok',
        message: 'Student Study Planner API is running!',
        time: new Date().toISOString()
    });
});

app.get('/api', (req, res) => {
    res.json({ 
        message: 'API is working',
        endpoints: ['/api/test', '/api/auth/register', '/api/auth/login', '/api/tasks']
    });
});

app.get('/api/test', (req, res) => {
    res.json({ message: 'Server working!' });
});

// Basic auth endpoints (mock for now)
app.post('/api/auth/register', (req, res) => {
    res.json({ message: 'Register endpoint - backend is working' });
});

app.post('/api/auth/login', (req, res) => {
    res.json({ message: 'Login endpoint - backend is working' });
});

app.get('/api/tasks', (req, res) => {
    res.json({ tasks: [] });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
