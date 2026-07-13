import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../AuthContext";

export default function SetUsername() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.setUsername(username);
      await refreshUser();
      navigate("/welcome");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      style={{ maxWidth: "400px", margin: "4rem auto", textAlign: "center" }}
    >
      <h2>Choose your username</h2>
      <p style={{ opacity: 0.7 }}>This is how people will find you on Pixora</p>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value.trim())}
          required
          minLength={3}
          style={{ width: "100%", padding: "0.6rem" }}
        />
        <br />
        <br />
        <button type="submit">Continue</button>
      </form>
    </div>
  );
}
