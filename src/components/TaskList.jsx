import TaskItem from "./TaskItem";

function TaskList({ task, deleteTask, toggleComplete }) {
  const tasks = Array.isArray(task) ? task : [];

  if (tasks.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <p>No tasks to display. Add a task to get started!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((t) => (
        <TaskItem
          key={t.id}
          task={t}
          deleteTask={deleteTask}
          toggleComplete={toggleComplete}
        />
      ))}
    </div>
  );
}

export default TaskList;
