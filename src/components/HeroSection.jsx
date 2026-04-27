import { useNavigate } from "react-router-dom";

function HeroSection() {
  const navigate = useNavigate();

  return (
    <div className="hero-section">
      <h1>Plan Smarter. Study Better. Stay Ahead</h1>
      <p>
        Student Study Planner helps students organize tasks, manage weekly
        study goals and stay on top of deadlines in one simple place.
      </p>
      <div className="hero-buttons">
        <button onClick={() => navigate("/add")} className="get-started">
          Get Started
        </button>
        <button onClick={() => navigate("/timetable")} className="secondary-button">
          New Timetable
        </button>
      </div>
    </div>
  );
}

export default HeroSection;
