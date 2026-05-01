import HeroSection from "../components/HeroSection";
import ReminderCard from "../components/ReminderCard";

function Home({ task }) {
  const safeTasks = Array.isArray(task) ? task : [];

  return (
    <div className="home-page">
      <div className="home-container">
        <div className="hero-wrapper">
          <HeroSection />
        </div>

        <div className="sidebar-wrapper">
          <ReminderCard task={safeTasks} />
        </div>
      </div>
    </div>
  );
}

export default Home;
