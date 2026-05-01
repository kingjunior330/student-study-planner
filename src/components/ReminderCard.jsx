function ReminderCard({ task }) {
  const tasks = Array.isArray(task) ? task : [];
  const upcomingTask = tasks.find((t) => !t.completed) || tasks[0];

  return (
    <div className="reminder-card">
      <h2>Upcoming Task</h2>

      {upcomingTask ? (
        <div>
          <h3>{upcomingTask.title}</h3>
          <p><strong>Day:</strong> {upcomingTask.day}</p>
          <p><strong>Due Date:</strong> {upcomingTask.due_date || upcomingTask.dueDate}</p>
          <p>
            <strong>Status:</strong>{" "}
            {upcomingTask.completed ? "Completed ✓" : "Not Completed"}
          </p>
        </div>
      ) : (
        <p>No pending tasks found. Add a task to get started!</p>
      )}
    </div>
  );
}

export default ReminderCard;
