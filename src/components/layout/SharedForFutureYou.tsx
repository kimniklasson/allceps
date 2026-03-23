import { useLocation, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect, useCallback } from "react";

const LINES = ["For", "future", "you."];
const HEADER_SCALE = 14 / 96;
const HERO_TOP = 128;
const HEADER_TOP = 43; // vertically centered in header
const SCROLL_THRESHOLD = 100;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function SharedForFutureYou() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const [heroKey, setHeroKey] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [animating, setAnimating] = useState(false);
  const prevIsHome = useRef(isHome);

  // Scroll tracking on home page
  const onScroll = useCallback(() => {
    setScrollProgress(Math.min(window.scrollY / SCROLL_THRESHOLD, 1));
  }, []);

  useEffect(() => {
    if (!isHome || animating) return;
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome, animating, onScroll]);

  // Route change: animate transitions, replay letter-flex on return
  useEffect(() => {
    if (isHome && !prevIsHome.current) {
      setAnimating(true);
      setScrollProgress(0);
      const timer = setTimeout(() => {
        setHeroKey((k) => k + 1);
        setAnimating(false);
      }, 450);
      return () => clearTimeout(timer);
    }
    prevIsHome.current = isHome;
  }, [isHome]);

  // Calculate position and scale
  let top: number;
  let scale: number;
  let useTransition: boolean;

  if (!isHome) {
    top = HEADER_TOP;
    scale = HEADER_SCALE;
    useTransition = true;
  } else if (animating) {
    top = HERO_TOP;
    scale = 1;
    useTransition = true;
  } else {
    top = lerp(HERO_TOP, HEADER_TOP, scrollProgress);
    scale = lerp(1, HEADER_SCALE, scrollProgress);
    useTransition = false;
  }

  const isCollapsed = !isHome || scrollProgress >= 1;

  return (
    <div
      className="ffy-container"
      style={{
        top,
        transition: useTransition ? undefined : "none",
      }}
      onClick={isCollapsed ? () => navigate("/") : undefined}
      role={isCollapsed ? "button" : undefined}
      aria-label={isCollapsed ? "Hem" : undefined}
    >
      <div
        className="ffy-text"
        style={{
          fontSize: 96,
          lineHeight: "62%",
          letterSpacing: "-0.05em",
          textAlign: "center",
          color: "#FFD900",
          fontFamily: "var(--font-sans)",
          transform: `scale(${scale})`,
          transition: useTransition ? undefined : "none",
        }}
      >
        {/* Inner div keyed for letter-flex replay */}
        <div key={heroKey}>
          {LINES.map((line, lineIdx) => (
            <div key={lineIdx}>
              {Array.from(line).map((char, charIdx) => (
                <span key={`${lineIdx}-${charIdx}`} className="letter-flex">
                  {char}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
