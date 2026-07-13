import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function PeopleSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .getPeopleSuggestions()
      .then((data) => setSuggestions(data.suggestions || []))
      .finally(() => setLoading(false));
  }, []);

  const requestLocationAndFetch = () => {
    if (!navigator.geolocation) {
      goHome();
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          await api.saveLocation(pos.coords.latitude, pos.coords.longitude, "");
        } catch (e) {
          // ignore errors, just proceed
        }
        goHome();
      },
      () => goHome(), // permission denied bhi to just move on
    );
  };

  const goHome = () => navigate("/");

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div
      style={{ maxWidth: "500px", margin: "2rem auto", textAlign: "center" }}
    >
      <h2>Find people you may know</h2>
      <p style={{ opacity: 0.7 }}>
        Allow location access to see nearby suggestions
      </p>

      {suggestions.length === 0 ? (
        <p style={{ margin: "2rem 0", opacity: 0.6 }}>
          No suggestions yet — check back later!
        </p>
      ) : (
        suggestions.map((s) => <div key={s.id}>{s.username}</div>)
      )}

      <div
        style={{
          marginTop: "2rem",
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
        }}
      >
        <button onClick={requestLocationAndFetch}>Allow Location</button>
        <button onClick={goHome} style={{ opacity: 0.7 }}>
          Skip
        </button>
      </div>
    </div>
  );
}
