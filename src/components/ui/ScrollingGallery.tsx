import { useState } from "react";

const IMAGES = [
  "/gallery/1.jpg",
  "/gallery/2.jpg",
  "/gallery/3.jpg",
  "/gallery/4.jpg",
  "/gallery/5.jpg",
];

export function ScrollingGallery() {
  const [paused, setPaused] = useState(false);
  const doubled = [...IMAGES, ...IMAGES];

  return (
    <>
      <div
        className="w-full overflow-hidden"
        onPointerDown={() => setPaused(true)}
        onPointerUp={() => setPaused(false)}
        onPointerCancel={() => setPaused(false)}
        onPointerLeave={() => setPaused(false)}
      >
        <div
          className="flex gap-4"
          style={{
            width: "max-content",
            animation: `gallery-scroll ${IMAGES.length * 4.5}s linear infinite`,
            animationPlayState: paused ? "paused" : "running",
          }}
        >
          {doubled.map((src, i) => (
            <img
              key={i}
              src={src}
              className="h-[400px] w-auto rounded-xl flex-shrink-0 object-cover border border-black/10 dark:border-white/15"
              draggable={false}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes gallery-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </>
  );
}
