const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

const db = require("./config/database");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Student Study Planner API is running" });
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend working" });
});

app.use("/api/auth", authRoutes);

function getUserId(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "my_secret_key"
    );
    return decoded.userId;
  } catch {
    return null;
  }
}

app.get("/api/tasks", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const tasks = await db.allAsync(
      "SELECT * FROM tasks WHERE user_id = ? ORDER BY due_date ASC",
      [userId]
    );

    res.json({ tasks });
  } catch (error) {
    console.error("GET TASKS ERROR:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/tasks", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { title, day, due_date } = req.body;

    if (!title || !day || !due_date) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const result = await db.runAsync(
      "INSERT INTO tasks (user_id, title, day, due_date) VALUES (?, ?, ?, ?)",
      [userId, title, day, due_date]
    );

    res.json({
      success: true,
      task: {
        id: result.lastID,
        user_id: userId,
        title,
        day,
        due_date,
        completed: 0
      }
    });
  } catch (error) {
    console.error("ADD TASK ERROR:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/api/tasks/:id", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const completed = req.body.completed ? 1 : 0;

    await db.runAsync(
      "UPDATE tasks SET completed = ? WHERE id = ? AND user_id = ?",
      [completed, req.params.id, userId]
    );

    res.json({ success: true });
  } catch (error) {
    console.error("UPDATE TASK ERROR:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    await db.runAsync(
      "DELETE FROM tasks WHERE id = ? AND user_id = ?",
      [req.params.id, userId]
    );

    res.json({ success: true });
  } catch (error) {
    console.error("DELETE TASK ERROR:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("✅ Server running on port " + PORT);
});
