import fs from "fs";
import path from "path";

const optionsDir = path.join(process.cwd(), "public", "options");
if (!fs.existsSync(optionsDir)) {
  fs.mkdirSync(optionsDir, { recursive: true });
}

function makeSvg(title, emoji, bgGradient, accentColor, innerSvg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      ${bgGradient}
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <rect width="400" height="400" rx="48" fill="url(#grad)" />
  <circle cx="200" cy="180" r="110" fill="${accentColor}" opacity="0.25" filter="url(#glow)" />
  <circle cx="200" cy="180" r="85" fill="${accentColor}" opacity="0.18" />
  
  <!-- Main Illustration / Graphic -->
  <g transform="translate(0, 0)">
    ${innerSvg}
  </g>
  
  <!-- Decorative sparkles -->
  <path d="M 80 90 Q 80 105 65 105 Q 80 105 80 120 Q 80 105 95 105 Q 80 105 80 90 Z" fill="#ffd166" opacity="0.8" />
  <path d="M 330 90 Q 330 105 315 105 Q 330 105 330 120 Q 330 105 345 105 Q 330 105 330 90 Z" fill="#ffd166" opacity="0.8" />
  <circle cx="310" cy="270" r="5" fill="#f472b6" opacity="0.7" />
  <circle cx="90" cy="270" r="4" fill="#a78bfa" opacity="0.7" />

  <!-- Emoji Badge -->
  <text x="200" y="205" font-size="88" text-anchor="middle" dominant-baseline="central">${emoji}</text>
  
  <!-- Title Badge -->
  <rect x="70" y="310" width="260" height="52" rx="26" fill="#0b0e1d" opacity="0.75" stroke="${accentColor}" stroke-width="1.5" />
  <text x="200" y="342" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle">${title}</text>
</svg>`;
}

const items = [
  {
    filename: "pizza.svg",
    title: "Crispy Pizza",
    emoji: "🍕",
    bg: `<stop offset="0%" stop-color="#b91c1c"/><stop offset="100%" stop-color="#450a0a"/>`,
    accent: "#ef4444",
    inner: `<path d="M140 100 Q200 60 260 100" stroke="#fca5a5" stroke-width="4" fill="none" opacity="0.3"/>`,
  },
  {
    filename: "burger.svg",
    title: "Juicy Burger",
    emoji: "🍔",
    bg: `<stop offset="0%" stop-color="#c2410c"/><stop offset="100%" stop-color="#431407"/>`,
    accent: "#f97316",
    inner: `<circle cx="200" cy="180" r="70" stroke="#fdba74" stroke-width="2" stroke-dasharray="6 6" fill="none" opacity="0.3"/>`,
  },
  {
    filename: "coffee.svg",
    title: "Iced Coffee",
    emoji: "☕",
    bg: `<stop offset="0%" stop-color="#78350f"/><stop offset="100%" stop-color="#1c1917"/>`,
    accent: "#b45309",
    inner: `<path d="M190 80 Q200 65 210 80" stroke="#fde68a" stroke-width="3" fill="none" opacity="0.5"/>`,
  },
  {
    filename: "boba.svg",
    title: "Sweet Boba",
    emoji: "🧋",
    bg: `<stop offset="0%" stop-color="#be185d"/><stop offset="100%" stop-color="#500724"/>`,
    accent: "#ec4899",
    inner: `<circle cx="180" cy="240" r="8" fill="#3b0764"/><circle cx="200" cy="245" r="8" fill="#3b0764"/><circle cx="220" cy="240" r="8" fill="#3b0764"/>`,
  },
  {
    filename: "cat.svg",
    title: "Cute Cat",
    emoji: "🐱",
    bg: `<stop offset="0%" stop-color="#86198f"/><stop offset="100%" stop-color="#3b0764"/>`,
    accent: "#d946ef",
    inner: `<path d="M130 130 L160 170 M270 130 L240 170" stroke="#f0abfc" stroke-width="3" stroke-linecap="round" opacity="0.5"/>`,
  },
  {
    filename: "dog.svg",
    title: "Fluffy Dog",
    emoji: "🐶",
    bg: `<stop offset="0%" stop-color="#a16207"/><stop offset="100%" stop-color="#422006"/>`,
    accent: "#eab308",
    inner: `<circle cx="200" cy="180" r="80" stroke="#fef08a" stroke-width="2" stroke-dasharray="8 8" fill="none" opacity="0.3"/>`,
  },
  {
    filename: "beach.svg",
    title: "Sunny Beach",
    emoji: "🏖️",
    bg: `<stop offset="0%" stop-color="#0284c7"/><stop offset="100%" stop-color="#082f49"/>`,
    accent: "#38bdf8",
    inner: `<path d="M100 240 Q150 220 200 240 T300 240" stroke="#bae6fd" stroke-width="3" fill="none" opacity="0.4"/>`,
  },
  {
    filename: "mountain.svg",
    title: "Misty Mountains",
    emoji: "⛰️",
    bg: `<stop offset="0%" stop-color="#047857"/><stop offset="100%" stop-color="#022c22"/>`,
    accent: "#10b981",
    inner: `<polygon points="200,80 270,220 130,220" stroke="#6ee7b7" stroke-width="2" fill="none" opacity="0.3"/>`,
  },
  {
    filename: "home.svg",
    title: "Cozy Stay-In",
    emoji: "🛋️",
    bg: `<stop offset="0%" stop-color="#4338ca"/><stop offset="100%" stop-color="#1e1b4b"/>`,
    accent: "#6366f1",
    inner: `<circle cx="200" cy="180" r="75" stroke="#a5b4fc" stroke-width="2" fill="none" opacity="0.3"/>`,
  },
  {
    filename: "party.svg",
    title: "Night Out / Party",
    emoji: "🪩",
    bg: `<stop offset="0%" stop-color="#701a75"/><stop offset="100%" stop-color="#2e1065"/>`,
    accent: "#c084fc",
    inner: `<line x1="200" y1="60" x2="200" y2="120" stroke="#f5d0fe" stroke-width="3" opacity="0.4"/>`,
  },
  {
    filename: "sweet.svg",
    title: "Sweet Dessert",
    emoji: "🍰",
    bg: `<stop offset="0%" stop-color="#db2777"/><stop offset="100%" stop-color="#4c0519"/>`,
    accent: "#f472b6",
    inner: `<circle cx="200" cy="180" r="80" stroke="#fbcfe8" stroke-width="2" stroke-dasharray="4 8" fill="none" opacity="0.3"/>`,
  },
  {
    filename: "spicy.svg",
    title: "Spicy Street Food",
    emoji: "🌶️",
    bg: `<stop offset="0%" stop-color="#e11d48"/><stop offset="100%" stop-color="#4c0519"/>`,
    accent: "#fb7185",
    inner: `<path d="M190 90 Q210 110 200 130" stroke="#fecdd3" stroke-width="3" fill="none" opacity="0.5"/>`,
  },
  {
    filename: "morning.svg",
    title: "Early Sunrise",
    emoji: "🌅",
    bg: `<stop offset="0%" stop-color="#d97706"/><stop offset="100%" stop-color="#451a03"/>`,
    accent: "#f59e0b",
    inner: `<circle cx="200" cy="220" r="60" fill="#fde68a" opacity="0.2"/>`,
  },
  {
    filename: "night.svg",
    title: "Late Night Owl",
    emoji: "🌙",
    bg: `<stop offset="0%" stop-color="#312e81"/><stop offset="100%" stop-color="#0f172a"/>`,
    accent: "#818cf8",
    inner: `<circle cx="150" cy="120" r="2" fill="#fff"/><circle cx="260" cy="110" r="3" fill="#fff"/><circle cx="280" cy="150" r="2" fill="#fff"/>`,
  },
  {
    filename: "gaming.svg",
    title: "Video Games",
    emoji: "🎮",
    bg: `<stop offset="0%" stop-color="#4f46e5"/><stop offset="100%" stop-color="#0f172a"/>`,
    accent: "#818cf8",
    inner: `<rect x="130" y="110" width="140" height="90" rx="20" stroke="#a5b4fc" stroke-width="2" fill="none" opacity="0.25"/>`,
  },
  {
    filename: "movies.svg",
    title: "Binge Movies",
    emoji: "🍿",
    bg: `<stop offset="0%" stop-color="#991b1b"/><stop offset="100%" stop-color="#18181b"/>`,
    accent: "#f87171",
    inner: `<rect x="140" y="120" width="120" height="80" rx="12" stroke="#fca5a5" stroke-width="2" fill="none" opacity="0.25"/>`,
  },
  {
    filename: "cuddle.svg",
    title: "Warm Cuddles",
    emoji: "🧸",
    bg: `<stop offset="0%" stop-color="#9d174d"/><stop offset="100%" stop-color="#3b0764"/>`,
    accent: "#f472b6",
    inner: `<path d="M170 120 C170 90 200 90 200 120 C200 90 230 90 230 120 C230 150 200 170 200 180 C200 170 170 150 170 120 Z" fill="#ec4899" opacity="0.3"/>`,
  },
  {
    filename: "roadtrip.svg",
    title: "Road Trip Drive",
    emoji: "🚗",
    bg: `<stop offset="0%" stop-color="#0369a1"/><stop offset="100%" stop-color="#0c4a6e"/>`,
    accent: "#38bdf8",
    inner: `<line x1="120" y1="230" x2="280" y2="230" stroke="#7dd3fc" stroke-width="4" stroke-dasharray="10 8" opacity="0.4"/>`,
  },
  {
    filename: "cooking.svg",
    title: "Cooking Chef",
    emoji: "🍳",
    bg: `<stop offset="0%" stop-color="#b45309"/><stop offset="100%" stop-color="#292524"/>`,
    accent: "#fbbf24",
    inner: `<circle cx="200" cy="180" r="70" stroke="#fde68a" stroke-width="2" fill="none" opacity="0.3"/>`,
  },
  {
    filename: "takeout.svg",
    title: "Late Takeout",
    emoji: "🥡",
    bg: `<stop offset="0%" stop-color="#b91c1c"/><stop offset="100%" stop-color="#311010"/>`,
    accent: "#f87171",
    inner: `<rect x="140" y="130" width="120" height="90" rx="14" stroke="#fca5a5" stroke-width="2" fill="none" opacity="0.3"/>`,
  },
];

for (const item of items) {
  const filePath = path.join(optionsDir, item.filename);
  const content = makeSvg(item.title, item.emoji, item.bg, item.accent, item.inner);
  fs.writeFileSync(filePath, content, "utf8");
}

console.log(`Generated ${items.length} option SVGs in ${optionsDir}`);
