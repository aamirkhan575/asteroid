import localFont from "next/font/local";

/**
 * Self-hosted fonts (no third-party requests → faster LCP, no layout shift,
 * GDPR-friendly). Exposed as CSS variables consumed in styles/base/tokens.css.
 */
export const fontDisplay = localFont({
  src: "../assets/fonts/BricolageGrotesque-Variable.woff2",
  variable: "--font-display",
  weight: "200 800",
  display: "swap",
  preload: true,
});

export const fontSerif = localFont({
  src: "../assets/fonts/InstrumentSerif-Italic.woff2",
  variable: "--font-serif",
  style: "italic",
  weight: "400",
  display: "swap",
});

export const fontMono = localFont({
  src: [
    { path: "../assets/fonts/JetBrainsMono-Regular.woff2", weight: "400" },
    { path: "../assets/fonts/JetBrainsMono-Medium.woff2", weight: "500" },
  ],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

export const fontArabic = localFont({
  src: "../assets/fonts/Alexandria-Arabic-Variable.woff2",
  variable: "--font-arabic",
  weight: "100 900",
  display: "swap",
  preload: false,
});

export const fontArabicSerif = localFont({
  src: "../assets/fonts/Amiri-Arabic-Bold.woff2",
  variable: "--font-arabic-serif",
  weight: "700",
  display: "swap",
  preload: false,
});

export const fontArabicText = localFont({
  src: [
    { path: "../assets/fonts/IBMPlexSansArabic-Regular.woff2", weight: "400" },
    { path: "../assets/fonts/IBMPlexSansArabic-Medium.woff2", weight: "500" },
  ],
  variable: "--font-arabic-text",
  display: "swap",
  preload: false,
});

export const fontVariables = [fontDisplay, fontSerif, fontMono, fontArabic, fontArabicSerif, fontArabicText]
  .map((f) => f.variable)
  .join(" ");
