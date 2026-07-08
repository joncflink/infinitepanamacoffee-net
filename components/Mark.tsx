type MarkProps = {
  className?: string;
  variant?: "dark" | "light";
};

const BASE_STROKE = 1.3;

// One continuous ribbon, split into its 16 bezier segments so the four
// segments touching the crossover (and their neighbors) can carry a barely
// perceptible taper — full width away from the center, ~4% thinner right at
// the crossing, like natural fountain-pen line variation.
const RIBBON_SEGMENTS = [
  { d: "M140.000,50.000 C140.000,56.072 138.360,63.921 135.430,68.218", w: 1 },
  { d: "M135.430,68.218 C132.500,72.505 127.840,75.760 122.430,75.760", w: 1 },
  { d: "M122.430,75.760 C117.010,75.760 110.030,72.505 102.960,68.218", w: 0.98 },
  { d: "M102.960,68.218 C95.890,63.921 87.650,56.072 80.000,50.000", w: 0.96 },
  { d: "M80.000,50.000 C72.350,43.928 64.110,36.079 57.040,31.782", w: 0.96 },
  { d: "M57.040,31.782 C49.970,27.495 42.990,24.240 37.570,24.240", w: 0.98 },
  { d: "M37.570,24.240 C32.160,24.240 27.500,27.495 24.570,31.782", w: 1 },
  { d: "M24.570,31.782 C21.640,36.079 20.000,43.928 20.000,50.000", w: 1 },
  { d: "M20.000,50.000 C20.000,56.072 21.640,63.921 24.570,68.218", w: 1 },
  { d: "M24.570,68.218 C27.500,72.505 32.160,75.760 37.570,75.760", w: 1 },
  { d: "M37.570,75.760 C42.990,75.760 49.970,72.505 57.040,68.218", w: 0.98 },
  { d: "M57.040,68.218 C64.110,63.921 72.350,56.072 80.000,50.000", w: 0.96 },
  { d: "M80.000,50.000 C87.650,43.928 95.890,36.079 102.960,31.782", w: 0.96 },
  { d: "M102.960,31.782 C110.030,27.495 117.010,24.240 122.430,24.240", w: 0.98 },
  { d: "M122.430,24.240 C127.840,24.240 132.500,27.495 135.430,31.782", w: 1 },
  { d: "M135.430,31.782 C138.360,36.079 140.000,43.928 140.000,50.000", w: 1 },
];

const STAR_PATH =
  "M80,32.45 C81,37.45 83,39.45 88,40.45 C83,41.45 81,44.06 80,49.06 C79,44.06 77,41.45 72,40.45 C77,39.45 79,37.45 80,32.45 Z";

export default function Mark({ className = "", variant = "dark" }: MarkProps) {
  const loopColor = variant === "light" ? "#f7f2e8" : "#1f4d3a";
  const textColor = variant === "light" ? "text-cream" : "text-forest";
  const subTextColor = variant === "light" ? "text-cream/80" : "text-charcoal";
  const underlineColor = variant === "light" ? "bg-gold/80" : "bg-gold";

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg viewBox="0 0 160 90" aria-hidden="true" className="h-16 w-auto">
        {RIBBON_SEGMENTS.map((seg, i) => (
          <path
            key={i}
            d={seg.d}
            fill="none"
            stroke={loopColor}
            strokeWidth={BASE_STROKE * seg.w}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}
        <path d={STAR_PATH} fill="#c8a44d" />
      </svg>
      <div
        className={`mt-2 font-heading text-[1.7rem] font-bold tracking-wide ${textColor}`}
      >
        INFINITE
      </div>
      <div
        className={`mt-1 text-[0.8rem] font-medium tracking-[0.35em] ${subTextColor}`}
      >
        PANAMA COFFEE
      </div>
      <div className={`mt-2 h-px w-28 ${underlineColor}`} />
    </div>
  );
}
