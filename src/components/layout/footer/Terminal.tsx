"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/config/site";
import { EVENTS } from "@/lib/env";
import { mailHref, telHref, whatsappHref } from "@/lib/contact";

type Line = { id: number; kind: "cmd" | "out" | "ok" | "chips"; content: React.ReactNode };

const COMMANDS = ["about", "whatsapp", "call", "email", "pricing", "work", "hours", "launch", "clear"] as const;

/** Interactive footer terminal. Types a short boot sequence when it scrolls into view. */
export function Terminal({ title, placeholder }: { title: string; placeholder: string }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const idRef = useRef(0);
  const booted = useRef(false);

  const push = (kind: Line["kind"], content: React.ReactNode) =>
    setLines((ls) => [...ls, { id: idRef.current++, kind, content }]);
  const go = (selector: string) => window.dispatchEvent(new CustomEvent(EVENTS.scrollTo, { detail: selector }));

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase().replace(/^asteroid\s+/, "").replace(/^--/, "");
    push("cmd", raw);
    if (!cmd) return;
    const ext = { target: "_blank", rel: "noopener noreferrer" } as const;
    switch (cmd.split(" ")[0]) {
      case "help":
        push("out", "Available commands:");
        push("chips", null);
        break;
      case "about":
        push("out", "Asteroid — premium website design agency in Dubai, UAE. 3D, bilingual, SEO-ready websites.");
        break;
      case "whatsapp":
        push("ok", <>Opening a channel… <a href={whatsappHref("Hi Asteroid! (sent from your terminal 👾)")} {...ext}>chat on WhatsApp ↗</a> · {site.contact.phoneDisplay}</>);
        break;
      case "call":
        push("ok", <>Dial <a href={telHref}>{site.contact.phoneDisplay}</a> — a real person picks up.</>);
        break;
      case "email":
        push("ok", <>Write to <a href={mailHref("Hello from the terminal")}>{site.contact.email}</a></>);
        break;
      case "pricing":
        push("out", <>Launch ······ AED 10,000<br />Growth ······ AED 25,000<br />Signature ··· AED 50,000+</>);
        window.setTimeout(() => go("#pricing"), 500);
        break;
      case "work":
        push("out", "Loading 7 live projects…");
        window.setTimeout(() => go("#work"), 500);
        break;
      case "hours":
        push("out", "Sun–Fri · 9am–8pm GST. Messages outside hours get a reply first thing.");
        break;
      case "launch":
        push("ok", "T-minus 3… 2… 1… 🚀 Returning to orbit.");
        window.setTimeout(() => go("top"), 1200);
        break;
      case "clear":
        setLines([]);
        break;
      case "sudo":
        push("out", "Nice try. The only permission you need is to say hi → type whatsapp");
        break;
      default:
        push("out", `command not found: ${cmd} — type help`);
    }
  };

  // Boot sequence on first view.
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || booted.current) return;
        booted.current = true;
        io.disconnect();
        const script: [string, React.ReactNode][] = [
          ["asteroid --boot", <>Initialising mission control… <span className="g">OK</span></>],
          ["asteroid status", <>Taking new projects. <span className="g">● online</span></>],
          ["asteroid contact", <>WhatsApp &amp; call: <a href={whatsappHref()} target="_blank" rel="noopener noreferrer">{site.contact.phoneDisplay}</a> · {site.contact.email}</>],
        ];
        script.forEach(([cmd, out], i) => {
          window.setTimeout(() => push("cmd", cmd), i * 900);
          window.setTimeout(() => push("out", out), i * 900 + 450);
        });
        window.setTimeout(() => {
          push("out", "Available commands:");
          push("chips", null);
        }, script.length * 900 + 200);
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  return (
    <div className="term" id="term">
      <div className="term-bar">
        <i />
        <i />
        <i />
        <span>{title}</span>
      </div>
      <div
        className="term-body"
        ref={bodyRef}
        onClick={(e) => {
          const tag = (e.target as HTMLElement).tagName;
          if (tag !== "A" && tag !== "BUTTON") inputRef.current?.focus({ preventScroll: true });
        }}
      >
        <div>
          {lines.map((l) =>
            l.kind === "cmd" ? (
              <div key={l.id}>
                <span className="p">➜</span> <span className="g">~</span> <span className="c">{l.content}</span>
              </div>
            ) : l.kind === "chips" ? (
              <div className="chips" key={l.id}>
                {COMMANDS.map((c) => (
                  <button key={c} type="button" onClick={() => run(c)}>
                    {c}
                  </button>
                ))}
              </div>
            ) : (
              <div key={l.id} className={l.kind === "ok" ? "g" : "o"}>
                {l.content}
              </div>
            ),
          )}
        </div>
        <form
          className="term-in"
          onSubmit={(e) => {
            e.preventDefault();
            run(value);
            setValue("");
          }}
        >
          <span className="p">➜</span>
          <span className="g">~</span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            autoComplete="off"
            spellCheck={false}
            aria-label="Terminal command"
          />
        </form>
      </div>
    </div>
  );
}
