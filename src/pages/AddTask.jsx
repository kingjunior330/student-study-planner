import TaskForm from "../components/TaskForm";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function AddTask({ addTask }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddTask = async (taskData) => {
    setIsAdding(true);
    setError("");

    const result = await addTask(taskData);

    if (result.success) {
      navigate("/list");
    } else {
      setError(result.error || "Failed to add task");
      setIsAdding(false);
    }
  };

  return (
    <div className="add-page">
      <div className="add-task-centered">
        <h2>Add New Task</h2>

        {error && <div className="error-message">{error}</div>}

        <TaskForm onTaskAdded={handleAddTask} isAdding={isAdding} />
      </div>
    </div>
  );
}

export default AddTask;
