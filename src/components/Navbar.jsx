import { Link, useNavigate } from "react-router-dom";

function Navbar({ user, logout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h1 className="logo">Student Study Planner</h1>
      
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/list">Tasks</Link></li>
        <li><Link to="/add">Add Task</Link></li>
        <li><Link to="/timetable">Timetable</Link></li>
      </ul>

      <div className="nav-right">
        <div className="user-info">
          <span>Welcome, {user?.username}!</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
