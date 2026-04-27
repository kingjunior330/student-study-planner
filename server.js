const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/database');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Auth routes
app.use('/api/auth', authRoutes);

// Get user ID from token (simplified)
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

// Get all tasks for user
app.get('/api/tasks', async (req, res) => {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    
    try {
        const tasks = await db.allAsync('SELECT * FROM tasks WHERE user_id = ? ORDER BY due_date ASC', [userId]);
        res.json({ tasks });
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
        const result = await db.runAsync(
            'INSERT INTO tasks (user_id, title, day, due_date) VALUES (?, ?, ?, ?)',
            [userId, title, day, due_date]
        );
        res.json({ 
            success: true,
            task: { id: result.lastID, title, day, due_date, completed: 0 }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete task
app.delete('/api/tasks/:id', async (req, res) => {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    
    try {
        await db.runAsync('DELETE FROM tasks WHERE id = ? AND user_id = ?', [req.params.id, userId]);
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
        await db.runAsync('UPDATE tasks SET completed = ? WHERE id = ? AND user_id = ?', [completed, req.params.id, userId]);
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/test', (req, res) => {
    res.json({ message: 'Server working!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
