"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getAmbience } from "@/lib/audio/space-ambience";
import { EVENTS } from "@/lib/env";
import type { Dictionary } from "@/content";

type Labels = Pick<Dictionary["ui"], "soundOn" | "soundOff" | "volume" | "ambience" | "mute" | "soundTip" | "sound">;

/** Header sound toggle with equaliser bars and a volume panel. Press "M" to mute. */
export function SoundControl({ labels }: { labels: Labels }) {
  const [on, setOn] = useState(false);
  const [volume, setVolume] = useState(55);
  const [open, setOpen] = useState(false);
  const [tip, setTip] = useState(false);
  const [ready, setReady] = useState(false);
  const bars = useRef<(HTMLElement | null)[]>([]);
  const openTimer = useRef<number>(undefined);

  const peek = useCallback(() => {
    setOpen(true);
    window.clearTimeout(openTimer.current);
    openTimer.current = window.setTimeout(() => setOpen(false), 3500);
  }, []);

  const toggle = useCallback(
    (force?: boolean) => {
      const next = getAmbience().toggle(force);
      setOn(next);
      setTip(false);
      if (next) peek();
    },
    [peek],
  );

  // Restore volume, show the invitation tip after the intro.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ast-vol");
      if (saved !== null) {
        setVolume(Number(saved));
        getAmbience().setVolume(Number(saved) / 100);
      }
    } catch {
      /* ignore */
    }
    const timers: number[] = [];
    const onReady = () => {
      setReady(true);
      timers.push(window.setTimeout(() => !getAmbience().on && setTip(true), 1800));
      timers.push(window.setTimeout(() => setTip(false), 9000));
    };
    if (document.documentElement.dataset.ready === "1") onReady();
    else window.addEventListener(EVENTS.ready, onReady, { once: true });
    return () => {
      window.removeEventListener(EVENTS.ready, onReady);
      timers.forEach(clearTimeout);
    };
  }, []);

  // Keyboard shortcut + pause when the tab is hidden.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName ?? "").toLowerCase();
      if (e.key.toLowerCase() === "m" && tag !== "input" && tag !== "textarea") toggle();
    };
    const onVis = () => getAmbience().duck(document.hidden);
    window.addEventListener("keydown", onKey);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [toggle]);

  // Equaliser driven by the real audio spectrum.
  useEffect(() => {
    let raf = 0;
    const bins = [1, 3, 5, 8, 12];
    const loop = () => {
      const levels = getAmbience().on ? getAmbience().getLevels() : null;
      bars.current.forEach((b, i) => {
        if (b) b.style.height = `${3 + (levels ? levels[bins[i]] / 255 : 0) * 17}px`;
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onVolume = (v: number) => {
    setVolume(v);
    getAmbience().setVolume(v / 100);
    if (!getAmbience().on && v > 0) toggle(true);
    peek();
    try {
      localStorage.setItem("ast-vol", String(v));
    } catch {
      /* ignore */
    }
  };

  const label = on ? labels.soundOn : labels.soundOff;
  return (
    <div className={`sound${ready ? " ready" : ""}${on ? " on" : ""}${open ? " open" : ""}`} onPointerDown={peek}>
      <button className="snd-btn" aria-pressed={on} aria-label={label} data-cursor={labels.sound} onClick={() => toggle()}>
        <span className="eq" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <i key={i} ref={(el) => void (bars.current[i] = el)} />
          ))}
        </span>
        <span className="snd-txt">{label}</span>
      </button>
      <div className="snd-vol" role="group" aria-label={labels.volume}>
        <div className="snd-head">
          <span>{labels.volume}</span>
          <output>{volume}</output>
        </div>
        <div className="snd-row">
          <button type="button" className="snd-mute" aria-label={labels.mute} onClick={() => toggle()}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 9h4l5-4v14l-5-4H4z" />
              <path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" />
            </svg>
          </button>
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            aria-label={labels.volume}
            style={{ ["--v" as string]: `${volume}%` }}
            onChange={(e) => onVolume(Number(e.target.value))}
          />
        </div>
        <div className="snd-foot">
          <span>{labels.ambience}</span>
          <span>
            <kbd>M</kbd> {labels.mute}
          </span>
        </div>
      </div>
      <button type="button" className={`snd-tip${tip ? " show" : ""}`} onClick={() => toggle(true)} tabIndex={tip ? 0 : -1}>
        {labels.soundTip}
      </button>
    </div>
  );
}
