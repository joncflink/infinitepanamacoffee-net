"use client";

import { useState } from "react";
import { useCellar } from "@/components/CellarProvider";
import { logReorderEvent, type ReorderAction } from "@/lib/supabase/track";

export default function ReserveAction({
  lotId,
  passportNumber,
  href,
  label,
  className,
  action,
}: {
  lotId: string;
  passportNumber: string;
  href: string;
  label: string;
  className: string;
  action: ReorderAction;
}) {
  const [clicked, setClicked] = useState(false);
  const { isSaved, add } = useCellar();
  const saved = isSaved(lotId);

  return (
    <div className="flex flex-col items-center gap-2">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          setClicked(true);
          logReorderEvent({ lotId, passportNumber, action, destinationUrl: href });
        }}
        className={className}
      >
        {label}
      </a>
      {clicked &&
        (saved ? (
          <p className="text-xs text-forest">
            ✓ Added to your Infinite Cellar™
          </p>
        ) : (
          <button
            type="button"
            onClick={() => add(lotId)}
            className="text-xs text-forest underline underline-offset-4 transition-colors duration-300 hover:text-forest/80"
          >
            Add to My Infinite Cellar™
          </button>
        ))}
    </div>
  );
}
