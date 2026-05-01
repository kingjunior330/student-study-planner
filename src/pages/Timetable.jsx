import WeeklyTimetable from "../components/WeeklyTimetable";

function Timetable({ tasks }) {
  return (
    <div className="timetable-page">
      <WeeklyTimetable tasks={tasks} />
    </div>
  );
}

export default Timetable;
