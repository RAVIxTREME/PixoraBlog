import { useState } from "react";
import IntroAnimation from "./components/IntroAnimation";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";
import Profile from "./pages/Profile";

import SetUsername from "./pages/SetUsername";
import Welcome from "./pages/Welcome";
import PeopleSuggestions from "./pages/PeopleSuggestions";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  return user ? children : <Navigate to="/login" />;
}

function App() {
  const [showIntro, setShowIntro] = useState(
    () => !sessionStorage.getItem("introShown"),
  );
  const { loading } = useAuth();

  if (showIntro) {
    return (
      <IntroAnimation
        onFinish={() => {
          sessionStorage.setItem("introShown", "1");
          setShowIntro(false);
        }}
      />
    );
  }

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/explore"
            element={
              <PrivateRoute>
                <Explore />
              </PrivateRoute>
            }
          />
          <Route
            path="/create"
            element={
              <PrivateRoute>
                <CreatePost />
              </PrivateRoute>
            }
          />
          <Route
            path="/post/:id"
            element={
              <PrivateRoute>
                <PostDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/:username"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          // ... Routes ke andar add karo:
          <Route
            path="/set-username"
            element={
              <PrivateRoute>
                <SetUsername />
              </PrivateRoute>
            }
          />
          <Route
            path="/welcome"
            element={
              <PrivateRoute>
                <Welcome />
              </PrivateRoute>
            }
          />
          <Route
            path="/people-suggestions"
            element={
              <PrivateRoute>
                <PeopleSuggestions />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
