import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "1rem",
        borderBottom: "1px solid #616161",
      }}
    >
      <div style={{ display: "flex", gap: "1rem" }}>
        <Link to="/">Home</Link>
        {user && <Link to="/explore">Explore</Link>}
        {user && <Link to="/create">Write Post</Link>}
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
        {user ? (
          <>
            <Link to={`/profile/${user.username}`}>{user.username}</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
