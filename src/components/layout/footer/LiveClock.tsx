"use client";

import { useEffect, useState } from "react";

/** Live Dubai time + session uptime for the footer HUD. */
export function LiveClock() {
  const [now, setNow] = useState<string>("--:--:--");
  const [up, setUp] = useState("00:00");
  useEffect(() => {
    const t0 = Date.now();
    const tick = () => {
      setNow(new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Dubai", hour12: false }));
      const s = Math.floor((Date.now() - t0) / 1000);
      setUp(`${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <>
      <span>
        DXB <b>{now}</b> GST
      </span>
      <span>
        Session <b>{up}</b>
      </span>
    </>
  );
}
