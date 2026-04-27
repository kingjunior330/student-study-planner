import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        if (onLogin) onLogin(data.user);
        navigate("/list");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Connection error. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="auth-container"
      style={{
        backgroundImage: "url('/src/assets/drawing-calendar-with-clock-it_406811-85206.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "repeat",
        minHeight: "100vh",
        width: "100%",
        position: "relative"
      }}
    >
      {/* Dark overlay to make form pop */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1
      }} />
      
      <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div className="auth-card" style={{
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(12px)",
          borderRadius: "20px",
          padding: "45px 40px",
          maxWidth: "420px",
          width: "90%",
          margin: "20px",
          boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
          border: "1px solid rgba(255,255,255,0.3)"
        }}>
          <h2 style={{ textAlign: "center", marginBottom: "25px", color: "#2c3e50", fontSize: "1.8rem" }}>Login</h2>
          {error && <div className="error-message" style={{ marginBottom: "20px" }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "14px",
                marginBottom: "15px",
                border: "1px solid #ddd",
                borderRadius: "12px",
                fontSize: "15px",
                boxSizing: "border-box",
                transition: "all 0.3s"
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "14px",
                marginBottom: "20px",
                border: "1px solid #ddd",
                borderRadius: "12px",
                fontSize: "15px",
                boxSizing: "border-box",
                transition: "all 0.3s"
              }}
            />
            <button 
              type="submit" 
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                background: "linear-gradient(135deg, #4CAF50, #45a049)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "transform 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p style={{ textAlign: "center", marginTop: "25px", color: "#555" }}>
            Don't have an account? <Link to="/register" style={{ color: "#4CAF50", textDecoration: "none", fontWeight: "bold" }}>Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
