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

// HARDCODED BACKEND URL FOR TESTING
const API_URL = "https://student-study-planner-production.up.railway.app/api";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const addTask = async (task) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: task.title,
          day: task.day,
          due_date: task.dueDate
        }),
      });
      
      if (response.ok) {
        await fetchTasks();
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error("Error adding task:", error);
      return { success: false };
    }
  };

  const toggleComplete = async (id, currentStatus) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ completed: currentStatus ? 0 : 1 }),
      });
      await fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      await fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="/register" element={<Register onRegister={setUser} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Navbar user={user} logout={logout} />
      <Routes>
        <Route path="/" element={<Home task={tasks} />} />
        <Route
          path="/list"
          element={
            <List
              task={tasks}
              deleteTask={deleteTask}
              toggleComplete={toggleComplete}
            />
          }
        />
        <Route path="/add" element={<AddTask addTask={addTask} />} />
        <Route path="/timetable" element={<Timetable tasks={tasks} />} />
        <Route path="/details/:id" element={<Details tasks={tasks} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
