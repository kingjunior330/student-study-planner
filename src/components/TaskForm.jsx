import { useState } from "react";

function TaskForm({ onTaskAdded, isAdding }) {
  const [title, setTitle] = useState("");
  const [day, setDay] = useState("Monday");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !day || !dueDate) {
      alert("Please fill in all fields");
      return;
    }

    onTaskAdded({ title, day, dueDate });

    setTitle("");
    setDay("Monday");
    setDueDate("");
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Task Title</label>
        <input
          type="text"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isAdding}
        />
      </div>

      <div className="form-group">
        <label>Day</label>
        <select value={day} onChange={(e) => setDay(e.target.value)} disabled={isAdding}>
          <option>Monday</option>
          <option>Tuesday</option>
          <option>Wednesday</option>
          <option>Thursday</option>
          <option>Friday</option>
          <option>Saturday</option>
          <option>Sunday</option>
        </select>
      </div>

      <div className="form-group">
        <label>Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          disabled={isAdding}
        />
      </div>

      <button type="submit" className="submit-btn" disabled={isAdding}>
        {isAdding ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
}

export default TaskForm;
