import { useState, useRef } from "react";

const IMAGES = [
  "/gallery/1.jpg",
  "/gallery/2.jpg",
  "/gallery/3.jpg",
  "/gallery/4.jpg",
  "/gallery/5.jpg",
];

function Lightbox({ images, startIndex, onClose }: {
  images: string[];
  startIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startXRef = useRef(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    startXRef.current = e.clientX;
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setDragX(e.clientX - startXRef.current);
  };

  const handlePointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    if (dragX < -60 && index < images.length - 1) setIndex(index + 1);
    else if (dragX > 60 && index > 0) setIndex(index - 1);
    setDragX(0);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center" onClick={onClose}>
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 text-white/70 text-3xl leading-none !transform-none"
        aria-label="Stäng"
      >
        ✕
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-8 flex gap-2 z-10">
        {images.map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-all ${i === index ? "bg-white scale-125" : "bg-white/40"}`}
          />
        ))}
      </div>

      <div
        className="w-full h-full flex items-center overflow-hidden cursor-grab active:cursor-grabbing"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          className="flex h-full"
          style={{
            width: `${images.length * 100}%`,
            transform: `translateX(calc(${-index * (100 / images.length)}% + ${dragX / images.length}px))`,
            transition: dragging ? "none" : "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {images.map((src, i) => (
            <div
              key={i}
              className="h-full flex items-center justify-center"
              style={{ width: `${100 / images.length}%` }}
            >
              <img
                src={src}
                className="max-h-full max-w-full object-contain select-none"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ScrollingGallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const doubled = [...IMAGES, ...IMAGES];

  return (
    <>
      <div className="w-full overflow-hidden">
        <div
          className="flex gap-3"
          style={{
            width: "max-content",
            animation: `gallery-scroll ${IMAGES.length * 6}s linear infinite`,
          }}
        >
          {doubled.map((src, i) => (
            <img
              key={i}
              src={src}
              className="h-[360px] w-auto rounded-xl cursor-pointer flex-shrink-0 object-cover"
              onClick={() => setLightboxIndex(i % IMAGES.length)}
              draggable={false}
            />
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={IMAGES}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      <style>{`
        @keyframes gallery-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </>
  );
}
