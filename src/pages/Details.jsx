import { useParams, Link } from "react-router-dom";

function Details({ tasks = [] }) {
  const { id } = useParams();
  
  // Safety check - if tasks is undefined or not an array, use empty array
  const taskList = Array.isArray(tasks) ? tasks : [];
  const task = taskList.find((t) => t && t.id === parseInt(id));
  
  if (!task) {
    return (
      <div className="details-page">
        <h2>Task Not Found</h2>
        <p>The task you are looking for does not exist.</p>
        <Link to="/list">
          <button>Back to Task List</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="details-page">
      <h2>Task Details</h2>
      <div className="details-card">
        <h3>{task.title || "Untitled"}</h3>
        <p><strong>Day:</strong> {task.day || "Not set"}</p>
        <p><strong>Due Date:</strong> {task.due_date || task.dueDate || "Not set"}</p>
        <p><strong>Status:</strong> {task.completed ? "Completed ✓" : "Not Completed"}</p>
      </div>
      <Link to="/list">
        <button>Back to Task List</button>
      </Link>
    </div>
  );
}

export default Details;
