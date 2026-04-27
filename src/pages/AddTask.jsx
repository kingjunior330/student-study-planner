import TaskForm from "../components/TaskForm";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function AddTask({ addTask }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddTask = async (taskData) => {
    if (isAdding) return;
    
    setIsAdding(true);
    setError("");
    
    const result = await addTask(taskData);
    
    if (result && result.success) {
      navigate("/list");
    } else {
      setError(result?.error || "Failed to add task");
      setIsAdding(false);
    }
  };

  return (
    <div style={{
      backgroundImage: "url('/src/assets/back-to-school-to-do-list-note.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
      minHeight: "100vh",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      position: "relative"
    }}>
      {/* Dark overlay for better readability */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1
      }} />
      
      {/* Form container */}
      <div style={{
        position: "relative",
        zIndex: 2,
        width: "100%",
        maxWidth: "500px",
        padding: "40px",
        background: "white",
        borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "30px", color: "#2c3e50" }}>Add New Task</h2>
        {error && <div style={{ color: "red", marginBottom: "20px", textAlign: "center" }}>{error}</div>}
        <TaskForm onTaskAdded={handleAddTask} isAdding={isAdding} />
      </div>
    </div>
  );
}

export default AddTask;
