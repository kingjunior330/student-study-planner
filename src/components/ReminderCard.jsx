function ReminderCard({ task }) {
  const upcomingTask = task && task.length > 0 ? task[0] : null;

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
            <span className={upcomingTask.completed ? "completed-status" : "pending-status"}>
              {upcomingTask.completed ? "Completed ✓" : "Not Completed"}
            </span>
          </p>
        </div>
      ) : (
        <p>No pending tasks found. Add a task to get started!</p>
      )}
    </div>
  );
}

export default ReminderCard;
