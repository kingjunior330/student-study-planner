import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Details from "./pages/Details";
import AddTask from "./pages/AddTask";
import Timetable from "./pages/Timetable";
import List from "./pages/List";
import API_URL from "./services/api";

function App() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);

  // Load user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Fetch tasks
  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  // Add task
  const addTask = async (task) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title: task.title,
        day: task.day,
        due_date: task.dueDate
      })
    });

    if (response.ok) {
      fetchTasks();
      return { success: true };
    }

    return { success: false };
  };

  // Toggle complete
  const toggleComplete = async (id, currentStatus) => {
    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ completed: currentStatus ? 0 : 1 })
    });

    fetchTasks();
  };

  // Delete
  const deleteTask = async (id) => {
    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    fetchTasks();
  };

  // Auth
  const handleAuth = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setTasks([]);
  };

  return (
    <Router>
      {user && <Navbar user={user} logout={logout} />}

      <Routes>
        {!user ? (
          <>
            <Route path="/login" element={<Login onLogin={handleAuth} />} />
            <Route path="/register" element={<Register onRegister={handleAuth} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
            <Route path="/home" element={<Home task={tasks} />} />
            <Route path="/list" element={<List task={tasks} deleteTask={deleteTask} toggleComplete={toggleComplete} />} />
            <Route path="/add" element={<AddTask addTask={addTask} />} />
            <Route path="/details/:id" element={<Details tasks={tasks} />} />
            <Route path="/timetable" element={<Timetable tasks={tasks} />} />
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
