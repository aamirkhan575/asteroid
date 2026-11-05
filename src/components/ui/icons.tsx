/** Small inline UI icons. Brand icon library lives in /public/icons (see docs/BRAND.md). */
type P = { className?: string };

export const WhatsAppIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true" focusable="false">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.8 14.03c-.25.69-1.44 1.32-2 1.4-.51.08-1.15.11-1.86-.12-.43-.13-.98-.32-1.68-.62-2.96-1.28-4.9-4.27-5.04-4.47-.15-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.27-.3.59-.37.79-.37h.57c.18 0 .43-.07.67.51.25.59.84 2.04.91 2.19.07.15.12.32.02.52-.1.2-.15.32-.3.49-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.3.76 1.25 1.63 2.03 1.12 1 2.07 1.31 2.36 1.46.3.15.47.12.64-.07.17-.2.74-.86.94-1.16.2-.3.39-.25.66-.15.27.1 1.72.81 2.02.96.3.15.49.22.57.34.07.12.07.69-.18 1.38z" />
  </svg>
);

export const PhoneIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true" focusable="false">
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
  </svg>
);

export const MailIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" focusable="false">
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="M3.8 7l8.2 6 8.2-6" />
  </svg>
);

export const CareIcons: Record<"chat" | "clock" | "shield" | "growth", React.ReactNode> = {
  chat: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1.5-4A8 8 0 1 1 9 19.5z" /><path d="M9 11h6M9 14h4" /></svg>,
  clock: <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>,
  shield: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /><path d="M9 12l2 2 4-4" /></svg>,
  growth: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 17l6-6 4 4 8-8" /><path d="M15 7h6v6" /></svg>,
};

/** Flat fallback icons for the 3D feature cards (shown if WebGL is unavailable). */
export const FeatureFallbackIcons: Record<string, React.ReactNode> = {
  gem: <path d="M32 6l22 14v24L32 58 10 44V20z" />,
  phone: <rect x="20" y="6" width="24" height="52" rx="5" />,
  search: <><circle cx="28" cy="28" r="16" /><path d="M40 40l16 16" /></>,
  magnet: <path d="M10 50V14a4 4 0 0 1 4-4h36a4 4 0 0 1 4 4v24a4 4 0 0 1-4 4H22z" />,
  layers: <rect x="8" y="12" width="48" height="36" rx="4" />,
  globe: <><circle cx="32" cy="32" r="24" /><path d="M8 32h48" /></>,
};
