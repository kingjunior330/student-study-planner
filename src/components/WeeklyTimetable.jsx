import DayColumn from "./DayColumn";

function WeeklyTimetable({ tasks }) {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  return (
    <section className="timetable-section">
      <h2 style={{ color: "white", textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>Weekly Timetable</h2>
      <div className="timetable">
        {daysOfWeek.map((day) => {
          const tasksForDay = tasks.filter((task) => task.day === day);
          return <DayColumn key={day} day={day} tasks={tasksForDay} />;
        })}
      </div>
    </section>
  );
}

export default WeeklyTimetable;
