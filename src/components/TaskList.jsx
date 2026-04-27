import TaskItem from "./TaskItem";

function TaskList({ task, deleteTask, toggleComplete }) {
  // Ensure task is an array and remove any potential duplicates by ID
  const tasks = Array.isArray(task) ? task : [];
  
  // Remove duplicates based on unique ID
  const uniqueTasks = [];
  const seenIds = new Set();
  
  for (const t of tasks) {
    if (!seenIds.has(t.id)) {
      seenIds.add(t.id);
      uniqueTasks.push(t);
    }
  }
  
  if (uniqueTasks.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <p>No tasks to display. Add a task to get started!</p>
      </div>
    );
  }

  return (
    <div>
      {uniqueTasks.map((t) => (
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
