const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Make pool available to routes
app.locals.pool = pool;

app.use(cors());
app.use(express.json());

// Auth routes
app.use('/api/auth', authRoutes);

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server working with PostgreSQL!' });
});

// Get user ID from token
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
        const result = await pool.query('SELECT * FROM tasks WHERE user_id = $1 ORDER BY due_date ASC', [userId]);
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
        return res.status(400).json({ error: 'Missing fields' });
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

// Delete task
app.delete('/api/tasks/:id', async (req, res) => {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    
    try {
        await pool.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2', [req.params.id, userId]);
        res.json({ success: true });
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
        await pool.query('UPDATE tasks SET completed = $1 WHERE id = $2 AND user_id = $3', [completed, req.params.id, userId]);
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
