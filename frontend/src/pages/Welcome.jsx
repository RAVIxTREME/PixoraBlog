import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Welcome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [typed, setTyped] = useState("");

  const fullText = `Hey ${user?.username || ""}, Welcome to Pixora!`;

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTyped(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) {
        clearInterval(interval);
        setTimeout(() => navigate("/people-suggestions"), 1200);
      }
    }, 60);
    return () => clearInterval(interval);
  }, [fullText, navigate]);

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "2rem" }}>
        {typed}
        <span style={{ opacity: 0.6 }}>|</span>
      </h1>
    </div>
  );
}
