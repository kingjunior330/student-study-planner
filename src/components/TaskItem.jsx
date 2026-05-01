function TaskItem({ task, deleteTask, toggleComplete }) {
  return (
    <div className="task-item-wrapper">
      <div className={`task-item ${task.completed ? "completed" : ""}`}>
        <div>
          <h3>{task.title}</h3>
          <p>Day: {task.day}</p>
          <p>Due Date: {task.due_date || task.dueDate}</p>
          <p>Status: {task.completed ? "Completed" : "Not Completed"}</p>
        </div>
      </div>

      <div className="task-buttons">
        <button onClick={() => toggleComplete(task.id, task.completed)}>
          {task.completed ? "Mark as Incomplete" : "Mark as Complete"}
        </button>

        <button onClick={() => deleteTask(task.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskItem;
