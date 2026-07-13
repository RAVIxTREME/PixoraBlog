import { useEffect, useState } from "react";

const FULL_TEXT = "Welcome to Pixora!";
const TYPING_SPEED = 75;
const COLLISION_TIME = 1350;
const TYPEWRITER_START = COLLISION_TIME + 500;
const HIDE_AFTER_TYPING = 1400;

export default function IntroAnimation({ onFinish }) {
  const [collided, setCollided] = useState(false);
  const [typed, setTyped] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setCollided(true), COLLISION_TIME);

    const t2 = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setTyped(FULL_TEXT.slice(0, i + 1));
        i++;
        if (i >= FULL_TEXT.length) {
          clearInterval(interval);
          setShowCursor(false);
          setTimeout(() => {
            setHide(true);
            setTimeout(onFinish, 800);
          }, HIDE_AFTER_TYPING);
        }
      }, TYPING_SPEED);
    }, TYPEWRITER_START);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onFinish]);

  return (
    <div className={`intro-overlay ${hide ? "hide" : ""}`}>
      <div className="ball-track">
        <div className={`ball ball-left ${collided ? "collided" : ""}`} />
        <div className={`ball ball-right ${collided ? "collided" : ""}`} />
        <div className={`shockwave ${collided ? "pop" : ""}`} />
        <div className={`merged-pill ${collided ? "show" : ""}`} />
      </div>
      <div className={`welcome-text ${typed ? "visible" : ""}`}>
        {typed}
        {showCursor && <span className="cursor" />}
      </div>
    </div>
  );
}
