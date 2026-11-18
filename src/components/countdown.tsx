"use client";

import { useEffect, useState } from "react";
import { timeLeft } from "@/lib/format";

export function Countdown({ endsAt }: { endsAt: string }) {
  const [label, setLabel] = useState(() => timeLeft(new Date(endsAt)));

  useEffect(() => {
    const tick = () => setLabel(timeLeft(new Date(endsAt)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  return (
    <span className={label === "Ended" ? "text-red-700" : "text-yale"} suppressHydrationWarning>
      {label}
    </span>
  );
}
