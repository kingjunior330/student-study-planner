import DayColumn from "./DayColumn";

function WeeklyTimetable({ tasks }) {
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <section className="timetable-section">
      <h2>Weekly Timetable</h2>

      <div className="timetable">
        {daysOfWeek.map((day) => {
          const tasksForDay = safeTasks.filter((task) => task.day === day);
          return <DayColumn key={day} day={day} tasks={tasksForDay} />;
        })}
      </div>
    </section>
  );
}

export default WeeklyTimetable;
