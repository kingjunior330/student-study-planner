function DayColumn({ day, tasks }) {
  return (
    <div className="day-column">
      <h2>{day}</h2>

      {tasks.length === 0 ? (
        <p>No tasks for {day}</p>
      ) : (
        tasks.map((task) => (
          <div key={task.id} className="day-task">
            <h3>{task.title}</h3>
            <small>{task.due_date || task.dueDate}</small>
          </div>
        ))
      )}
    </div>
  );
}

export default DayColumn;
