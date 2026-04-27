import WeeklyTimetable from "../components/WeeklyTimetable";

function Timetable({ tasks }) {
  return (
    <div 
      className="timetable-page"
      style={{
        backgroundImage: "url('/src/assets/infs-202-project-picture.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        width: "100%",
        position: "relative"
      }}
    >
      {/* Dark overlay for better readability */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        zIndex: 1
      }} />
      
      {/* Content on top */}
      <div style={{ position: "relative", zIndex: 2, padding: "20px" }}>
        <WeeklyTimetable tasks={tasks} />
      </div>
    </div>
  );
}

export default Timetable;
