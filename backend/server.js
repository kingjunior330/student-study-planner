const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// ============ ROOT ENDPOINTS ============

// Root endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'Student Study Planner API is running!',
        endpoints: {
            test: '/api/test',
            register: '/api/auth/register',
            login: '/api/auth/login',
            tasks: '/api/tasks'
        }
    });
});

// API info endpoint
app.get('/api', (req, res) => {
    res.json({ 
        message: 'API is working',
        version: '1.0.0',
        endpoints: {
            test: '/api/test',
            register: '/api/auth/register (POST)',
            login: '/api/auth/login (POST)',
            tasks: '/api/tasks (GET, POST)'
        }
    });
});

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server working with PostgreSQL!' });
});

// ============ AUTH ROUTES ============

// Register
app.post('/api/auth/register', async (req, res) => {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields required' });
    }
    
    try {
        const bcrypt = require('bcryptjs');
        const jwt = require('jsonwebtoken');
        
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE email = $1 OR username = $2',
            [email, username]
        );
        
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
            [username, email, hashedPassword]
        );
        
        const token = jwt.sign(
            { userId: result.rows[0].id, email },
            process.env.JWT_SECRET || 'your_secret_key',
            { expiresIn: '7d' }
        );
        
        res.json({ message: 'User created', token, user: result.rows[0] });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'All fields required' });
    }
    
    try {
        const bcrypt = require('bcryptjs');
        const jwt = require('jsonwebtoken');
        
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        
        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || 'your_secret_key',
            { expiresIn: '7d' }
        );
        
        res.json({ 
            message: 'Login successful', 
            token, 
            user: { id: user.id, username: user.username, email: user.email } 
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ============ TASK ROUTES ============

// Helper to get user from token
const getUserId = (req) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return null;
    try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
        return decoded.userId;
    } catch (error) {
        return null;
    }
};

// Get all tasks
app.get('/api/tasks', async (req, res) => {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    
    try {
        const result = await pool.query(
            'SELECT * FROM tasks WHERE user_id = $1 ORDER BY due_date ASC',
            [userId]
        );
        res.json({ tasks: result.rows });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Create task
app.post('/api/tasks', async (req, res) => {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    
    const { title, day, due_date } = req.body;
    if (!title || !day || !due_date) {
        return res.status(400).json({ error: 'Title, day, and due_date required' });
    }
    
    try {
        const result = await pool.query(
            'INSERT INTO tasks (user_id, title, day, due_date) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, title, day, due_date]
        );
        res.json({ success: true, task: result.rows[0] });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update task
app.put('/api/tasks/:id', async (req, res) => {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    
    const { completed } = req.body;
    try {
        await pool.query(
            'UPDATE tasks SET completed = $1 WHERE id = $2 AND user_id = $3',
            [completed, req.params.id, userId]
        );
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete task
app.delete('/api/tasks/:id', async (req, res) => {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    
    try {
        await pool.query(
            'DELETE FROM tasks WHERE id = $1 AND user_id = $2',
            [req.params.id, userId]
        );
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
