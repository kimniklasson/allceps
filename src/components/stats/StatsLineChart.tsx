import { useRef, useEffect, useState } from "react";

interface DataPoint {
  label: string;
  value: number;
}

interface Props {
  data: DataPoint[];
  unit?: string;
}

const CHART_HEIGHT = 120;
const PADDING_TOP = 16;
const PADDING_BOTTOM = 4;
const PADDING_LEFT = 36;
const PADDING_RIGHT = 12;

export function StatsLineChart({ data, unit = "kg" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="rounded-card border border-black/10 dark:border-white/10 p-4">
        <p className="text-[13px] opacity-50 text-center">Ingen data ännu</p>
      </div>
    );
  }

  const values = data.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  const chartW = width - PADDING_LEFT - PADDING_RIGHT;
  const chartH = CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM;

  const points = data.map((d, i) => {
    const x = PADDING_LEFT + (data.length === 1 ? chartW / 2 : (i / (data.length - 1)) * chartW);
    const y = PADDING_TOP + chartH - ((d.value - minVal) / range) * chartH;
    return { x, y };
  });

  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");

  // Area polygon (line + close to bottom)
  const areaPoints = [
    `${points[0].x},${PADDING_TOP + chartH}`,
    ...points.map((p) => `${p.x},${p.y}`),
    `${points[points.length - 1].x},${PADDING_TOP + chartH}`,
  ].join(" ");

  // Y-axis grid lines (3 lines)
  const gridLines = [0, 0.5, 1].map((frac) => ({
    y: PADDING_TOP + chartH - frac * chartH,
    value: Math.round(minVal + frac * range),
  }));

  // Calculate total line length for stroke animation
  let lineLength = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    lineLength += Math.sqrt(dx * dx + dy * dy);
  }

  // Show max ~8 labels to avoid crowding
  const labelStep = Math.max(1, Math.ceil(data.length / 8));

  return (
    <div ref={containerRef} className="rounded-card border border-black/10 dark:border-white/10 p-4 overflow-hidden">
      {width > 0 && (
        <svg width={width} height={CHART_HEIGHT} className="block">
          {/* Grid lines */}
          {gridLines.map((gl) => (
            <g key={gl.y}>
              <line
                x1={PADDING_LEFT}
                y1={gl.y}
                x2={width - PADDING_RIGHT}
                y2={gl.y}
                stroke="currentColor"
                strokeOpacity={0.08}
                strokeWidth={1}
              />
              <text
                x={PADDING_LEFT - 6}
                y={gl.y + 3.5}
                textAnchor="end"
                fill="currentColor"
                fillOpacity={0.4}
                fontSize={10}
              >
                {gl.value}
              </text>
            </g>
          ))}

          {/* Area fill */}
          <polygon
            points={areaPoints}
            fill="#F5C800"
            fillOpacity={animate ? 0.12 : 0}
            style={{ transition: "fill-opacity 0.6s ease" }}
          />

          {/* Line */}
          <polyline
            points={polyline}
            fill="none"
            stroke="#F5C800"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={lineLength}
            strokeDashoffset={animate ? 0 : lineLength}
            style={{
              transition: `stroke-dashoffset 0.6s cubic-bezier(0.16, 1, 0.3, 1)`,
            }}
          />

          {/* Dots */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={3}
              fill="#F5C800"
              opacity={animate ? 1 : 0}
              style={{
                transition: `opacity 0.3s ease ${0.3 + i * 0.03}s`,
              }}
            />
          ))}

          {/* X labels */}
          {data.map((d, i) => {
            if (i % labelStep !== 0 && i !== data.length - 1) return null;
            return (
              <text
                key={i}
                x={points[i].x}
                y={CHART_HEIGHT}
                textAnchor="middle"
                fill="currentColor"
                fillOpacity={0.4}
                fontSize={10}
              >
                {d.label}
              </text>
            );
          })}
        </svg>
      )}

      {/* Unit label */}
      <div className="flex justify-end mt-1">
        <span className="text-[11px] opacity-40">{unit}</span>
      </div>
    </div>
  );
}
