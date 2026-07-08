type MarkProps = {
  className?: string;
  variant?: "dark" | "light";
};

export default function Mark({ className = "", variant = "dark" }: MarkProps) {
  const loopColor = variant === "light" ? "#f7f2e8" : "#1f4d3a";
  const textColor = variant === "light" ? "text-cream" : "text-forest";
  const subTextColor = variant === "light" ? "text-cream/80" : "text-charcoal";
  const underlineColor = variant === "light" ? "bg-gold/80" : "bg-gold";

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg viewBox="0 0 160 90" aria-hidden="true" className="h-14 w-auto">
        <path
          d="M140.00,50.00 C140.00,56.94 138.36,65.91 135.43,70.82 C132.50,75.72 127.84,79.44 122.43,79.44 C117.01,79.44 110.03,75.72 102.96,70.82 C95.89,65.91 87.65,56.94 80.00,50.00 C72.35,43.06 64.11,34.09 57.04,29.18 C49.97,24.28 42.99,20.56 37.57,20.56 C32.16,20.56 27.50,24.28 24.57,29.18 C21.64,34.09 20.00,43.06 20.00,50.00 C20.00,56.94 21.64,65.91 24.57,70.82 C27.50,75.72 32.16,79.44 37.57,79.44 C42.99,79.44 49.97,75.72 57.04,70.82 C64.11,65.91 72.35,56.94 80.00,50.00 C87.65,43.06 95.89,34.09 102.96,29.18 C110.03,24.28 117.01,20.56 122.43,20.56 C127.84,20.56 132.50,24.28 135.43,29.18 C138.36,34.09 140.00,43.06 140.00,50.00 Z"
          fill="none"
          stroke={loopColor}
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d="M80,32.45 C81,37.45 83,39.45 88,40.45 C83,41.45 81,43.45 80,48.45 C79,43.45 77,41.45 72,40.45 C77,39.45 79,37.45 80,32.45 Z"
          fill="#c8a44d"
        />
      </svg>
      <div
        className={`mt-2 font-heading text-2xl font-bold tracking-wide ${textColor}`}
      >
        INFINITE
      </div>
      <div
        className={`mt-1 text-xs font-medium tracking-[0.35em] ${subTextColor}`}
      >
        PANAMA COFFEE
      </div>
      <div className={`mt-2 h-px w-24 ${underlineColor}`} />
    </div>
  );
}
