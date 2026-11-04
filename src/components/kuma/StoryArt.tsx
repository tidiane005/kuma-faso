"use client";

// Scènes SVG animées inspirées des arts du Burkina Faso (papiers découpés, fresques kassena)
import { useId } from "react";

type Palette = {
  skyFrom: string;
  skyTo: string;
  sun: string;
  groundA: string;
  groundB: string;
  dark: string;
  accent: string;
};

const PALETTES: Record<string, Palette> = {
  cheval: { skyFrom: "#F7E7C3", skyTo: "#E8C37E", sun: "#E8A93B", groundA: "#C29B4C", groundB: "#A67B3C", dark: "#4A3423", accent: "#8A5A2B" },
  tamtam: { skyFrom: "#F2C48D", skyTo: "#C97C4A", sun: "#D9603B", groundA: "#8A5A2B", groundB: "#6B4326", dark: "#3B2A1A", accent: "#E0A32E" },
  masque: { skyFrom: "#EFE3C6", skyTo: "#CDAF77", sun: "#D9922E", groundA: "#8A6A42", groundB: "#6B4A2E", dark: "#33241A", accent: "#C2451E" },
  mosquee: { skyFrom: "#F6E7C8", skyTo: "#E3BE8A", sun: "#E0A32E", groundA: "#C99A63", groundB: "#A87C48", dark: "#4A3B2A", accent: "#7A5A3C" },
  pierre: { skyFrom: "#F1DDB2", skyTo: "#D9B26E", sun: "#DBA23A", groundA: "#9A6C3A", groundB: "#7A5228", dark: "#3E2A18", accent: "#E0A32E" },
  hippo: { skyFrom: "#E9EFDD", skyTo: "#BFD4B8", sun: "#E8B04B", groundA: "#5F8A72", groundB: "#3F6E64", dark: "#2E4A42", accent: "#E0A32E" },
  balafon: { skyFrom: "#54402E", skyTo: "#7A553A", sun: "#E8B04B", groundA: "#3B2C20", groundB: "#2E2118", dark: "#1E150E", accent: "#E0A32E" },
  baobab: { skyFrom: "#F8ECCB", skyTo: "#E3C389", sun: "#E5A93C", groundA: "#B09A5C", groundB: "#8F7A42", dark: "#4A3A22", accent: "#6E7F3C" },
  enfant: { skyFrom: "#463629", skyTo: "#6B4E33", sun: "#E8B04B", groundA: "#3B2C20", groundB: "#2C2016", dark: "#181009", accent: "#E0A32E" },
  crocodile: { skyFrom: "#EFE0BC", skyTo: "#CDB07E", sun: "#DDA33B", groundA: "#5A7A52", groundB: "#44603E", dark: "#2E3E2A", accent: "#C2451E" },
  fresque: { skyFrom: "#EFD9AF", skyTo: "#DDBE8A", sun: "#D9922E", groundA: "#C99A63", groundB: "#A87C48", dark: "#33241A", accent: "#C2451E" },
  elephant: { skyFrom: "#F2E0B6", skyTo: "#D2AE72", sun: "#E5A93C", groundA: "#A8823F", groundB: "#8A6830", dark: "#4A3A20", accent: "#7E8E4F" },
  dune: { skyFrom: "#F8E9BF", skyTo: "#EBC97F", sun: "#E5A93C", groundA: "#DBB06C", groundB: "#C29B4C", dark: "#5A4526", accent: "#8A6A42" },
  puits: { skyFrom: "#4A3A2C", skyTo: "#715538", sun: "#F2E3B8", groundA: "#4A3A28", groundB: "#382B1E", dark: "#181009", accent: "#E0A32E" },
};

const THEMES_VALIDES = Object.keys(PALETTES);

function Sun({ cx, cy, r, color, glow = true }: { cx: number; cy: number; r: number; color: string; glow?: boolean }) {
  return (
    <g className={glow ? "k-glow" : undefined}>
      <circle cx={cx} cy={cy} r={r} fill={color} opacity={0.35} />
      <circle cx={cx} cy={cy} r={r * 0.72} fill={color} />
    </g>
  );
}

function Birds({ color = "#4A3A22" }: { color?: string }) {
  return (
    <g opacity={0.75}>
      <g className="k-drift" style={{ animationDelay: "0s" }}>
        <path d="M40 52 q7 -7 14 0 M54 52 q7 -7 14 0" stroke={color} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      </g>
      <g className="k-drift" style={{ animationDelay: "-6s", animationDuration: "17s" }}>
        <path d="M20 84 q6 -6 12 0 M32 84 q6 -6 12 0" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
}

function Stars({ count = 14 }: { count?: number }) {
  const stars = Array.from({ length: count }, (_, i) => ({
    x: 12 + ((i * 83) % 376),
    y: 14 + ((i * 47) % 90),
    r: i % 3 === 0 ? 1.8 : 1.1,
    d: `${(i % 5) * 1.3}s`,
  }));
  return (
    <g fill="#F2E3B8">
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} className="k-blink" style={{ animationDelay: s.d }} opacity={0.9} />
      ))}
    </g>
  );
}

function Ground({ a, b }: { a: string; b: string }) {
  return (
    <>
      <path d="M0 196 Q90 176 200 194 T400 188 L400 240 L0 240 Z" fill={a} />
      <path d="M0 214 Q120 200 240 214 T400 210 L400 240 L0 240 Z" fill={b} />
    </>
  );
}

function Water({ a, b }: { a: string; b: string }) {
  return (
    <>
      <rect x="0" y="176" width="400" height="64" fill={b} />
      <rect x="0" y="176" width="400" height="18" fill={a} opacity={0.7} />
      <path d="M18 206 h44 M84 222 h56 M150 206 h40 M210 220 h60 M280 208 h44 M330 224 h40" stroke="#FFFFFF" strokeWidth="2" opacity={0.28} strokeLinecap="round" className="k-dash-move" />
    </>
  );
}

/* ---------- Sujets principaux ---------- */

function Cheval({ p, cavalier = false }: { p: Palette; cavalier?: boolean }) {
  return (
    <g transform="translate(46,30) scale(0.82)">
    <g className="k-bob">
      <ellipse cx="200" cy="208" rx="95" ry="10" fill={p.dark} opacity="0.18" />
      <path d="M286 138 q34 12 30 52 q-4 -26 -18 -38" fill="none" stroke={p.dark} strokeWidth="7" strokeLinecap="round" />
      <ellipse cx="196" cy="152" rx="72" ry="34" fill={p.dark} />
      <path d="M244 138 L278 92 L296 100 L268 156 Z" fill={p.dark} />
      <path d="M272 84 q26 -8 34 4 q6 10 -4 14 l-30 8 q-8 -14 0 -26 Z" fill={p.dark} />
      <circle cx="292" cy="92" r="2.6" fill={p.skyFrom} />
      <path d="M280 76 l8 -14 l6 12 Z" fill={p.dark} />
      <path d="M148 176 L142 212 M170 180 L168 214 M226 180 L230 212 M252 174 L262 210" stroke={p.dark} strokeWidth="11" strokeLinecap="round" />
      {cavalier && (
        <g>
          <path d="M196 118 q-2 -26 14 -30 q16 -2 16 16 l-4 20 Z" fill={p.accent} />
          <circle cx="216" cy="76" r="12" fill={p.dark} />
          <path d="M206 66 q10 -12 24 -4" stroke={p.accent} strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M212 122 L238 104" stroke={p.accent} strokeWidth="4" strokeLinecap="round" />
        </g>
      )}
      <g fill={p.groundB} opacity="0.5">
        <circle cx="120" cy="206" r="5" className="k-rise" />
        <circle cx="104" cy="210" r="3.4" className="k-rise" style={{ animationDelay: "1.4s" }} />
      </g>
    </g>
    </g>
  );
}

function Elephant({ p }: { p: Palette }) {
  return (
    <g transform="translate(30,22) scale(0.88)">
      <ellipse cx="200" cy="212" rx="110" ry="9" fill={p.dark} opacity="0.16" />
      <g className="k-float" style={{ animationDuration: "7s" }}>
        <ellipse cx="216" cy="140" rx="82" ry="58" fill={p.dark} />
        <circle cx="128" cy="126" r="44" fill={p.dark} />
        <circle cx="146" cy="118" r="30" fill={p.dark} opacity="0.85" />
        <circle cx="146" cy="118" r="30" fill="none" stroke={p.groundB} strokeWidth="2" opacity="0.5" />
        <path d="M96 138 q-20 24 -10 52 q4 12 16 10" fill="none" stroke={p.dark} strokeWidth="15" strokeLinecap="round" />
        <path d="M104 158 q-14 8 -22 4" fill="none" stroke="#F2E8D0" strokeWidth="6" strokeLinecap="round" />
        <circle cx="118" cy="118" r="3.4" fill={p.skyFrom} />
        <path d="M156 190 L156 218 M196 194 L196 220 M244 194 L244 220 M282 188 L282 216" stroke={p.dark} strokeWidth="20" strokeLinecap="round" />
      </g>
      <g fill={p.groundA}>
        <circle cx="150" cy="206" r="4.4" className="k-rise" />
        <circle cx="170" cy="210" r="3" className="k-rise" style={{ animationDelay: "2s" }} />
        <circle cx="130" cy="212" r="3.6" className="k-rise" style={{ animationDelay: "3.2s" }} />
      </g>
    </g>
  );
}

function Hippo({ p }: { p: Palette }) {
  return (
    <>
      <g stroke="#FFFFFF" fill="none" opacity="0.5">
        <ellipse cx="190" cy="196" rx="60" ry="10" strokeWidth="2" className="k-ripple" />
        <ellipse cx="190" cy="196" rx="60" ry="10" strokeWidth="2" className="k-ripple" style={{ animationDelay: "1.7s" }} />
      </g>
      <g className="k-float" style={{ animationDuration: "8s" }}>
        <path d="M150 196 q6 -44 44 -46 q38 2 46 30 l4 16 q-48 10 -94 0 Z" fill={p.dark} />
        <ellipse cx="236" cy="192" rx="18" ry="10" fill={p.dark} />
        <circle cx="164" cy="152" r="5" fill={p.dark} />
        <circle cx="196" cy="150" r="5" fill={p.dark} />
        <circle cx="172" cy="162" r="4" fill={p.skyFrom} />
        <circle cx="204" cy="160" r="4" fill={p.skyFrom} />
      </g>
      <g transform="translate(196,120)">
      <g className="k-float" style={{ animationDuration: "3.6s" }}>
        <ellipse cx="0" cy="0" rx="9" ry="6" fill={p.accent} />
        <circle cx="8" cy="-4" r="4" fill={p.accent} />
        <path d="M12 -4 l7 2 l-7 2 Z" fill={p.dark} />
      </g>
      </g>
    </>
  );
}

function Crocodile({ p }: { p: Palette }) {
  return (
    <>
      <Water a={p.groundA} b={p.groundB} />
      <g transform="translate(60,120) scale(0.94)">
      <g className="k-float" style={{ animationDuration: "9s" }}>
        <path d="M0 76 q30 -22 90 -18 q70 4 120 -6 q60 -12 96 8 q14 10 4 20 q-90 18 -180 12 q-90 -6 -130 -16 Z" fill={p.dark} />
        <path d="M70 52 l8 -12 l8 12 M100 48 l8 -12 l8 12 M130 46 l8 -12 l8 12" fill={p.dark} />
        <circle cx="292" cy="64" r="3.4" fill={p.skyFrom} />
        <circle cx="308" cy="66" r="1.8" fill={p.skyFrom} />
      </g>
      </g>
      <g stroke={p.dark} strokeWidth="3" strokeLinecap="round" className="k-sway">
        <path d="M36 232 q2 -22 -4 -34 M46 232 q0 -18 6 -30 M28 234 q-2 -16 4 -26" fill="none" />
      </g>
    </>
  );
}

function Masque({ p }: { p: Palette }) {
  return (
    <g transform="translate(200,120)">
    <g className="k-sway">
      <circle cx="0" cy="0" r="86" fill={p.sun} opacity="0.16" className="k-glow" />
      <path d="M-26 -58 q-8 -34 4 -52 M0 -60 q0 -38 0 -56 M26 -58 q10 -32 -2 -52" stroke={p.accent} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M-52 -34 q0 -34 52 -34 q52 0 52 34 q0 66 -52 96 q-52 -30 -52 -96 Z" fill={p.dark} />
      <g stroke={p.sun} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.9">
        <path d="M-40 -8 l-12 -6 M-40 6 l-14 0 M-38 20 l-12 6" />
        <path d="M40 -8 l12 -6 M40 6 l14 0 M38 20 l12 6" />
      </g>
      <path d="M-30 -6 l22 -8 l-2 20 Z" fill={p.sun} className="k-blink" />
      <path d="M30 -6 l-22 -8 l2 20 Z" fill={p.sun} className="k-blink" style={{ animationDelay: "0.6s" }} />
      <path d="M-4 8 l8 0 l-4 12 Z" fill={p.sun} opacity="0.8" />
      <path d="M-20 34 l8 8 l8 -8 l8 8 l8 -8 l8 8" stroke={p.accent} strokeWidth="4.5" fill="none" strokeLinecap="round" />
    </g>
    </g>
  );
}

function Mosquee({ p }: { p: Palette }) {
  const beams = Array.from({ length: 12 }, (_, i) => 96 + i * 18);
  return (
    <g>
      <Sun cx={330} cy={58} r={26} color={p.sun} />
      <rect x="70" y="118" width="260" height="78" fill={p.groundB} />
      {beams.map((x) => (
        <rect key={x} x={x} y="106" width="7" height="16" rx="2.4" fill={p.dark} />
      ))}
      <path d="M158 118 q42 -46 84 0 Z" fill={p.dark} />
      <path d="M182 196 v-34 q18 -22 36 0 v34 Z" fill={p.dark} opacity="0.9" />
      <rect x="88" y="60" width="24" height="60" fill={p.groundB} />
      {Array.from({ length: 4 }, (_, i) => (
        <rect key={i} x="84" y={64 + i * 14} width="32" height="4" rx="2" fill={p.dark} />
      ))}
      <path d="M86 60 q14 -22 28 0 Z" fill={p.dark} />
      <circle cx="100" cy="40" r="4" fill={p.accent} />
      <g fill={p.accent}>
        <circle cx="60" cy="150" r="2.6" className="k-blink" />
        <circle cx="350" cy="160" r="2.2" className="k-blink" style={{ animationDelay: "1.6s" }} />
      </g>
    </g>
  );
}

function Pierre({ p }: { p: Palette }) {
  const wall = (x: number, y: number, w: number, h: number, rows: number) => {
    const cells: React.ReactElement[] = [];
    for (let r = 0; r < rows; r++) {
      const n = Math.max(2, Math.round(w / 26));
      for (let c = 0; c < n; c++) {
        cells.push(
          <rect
            key={`${r}-${c}`}
            x={x + (c * w) / n + (r % 2 ? 6 : 0)}
            y={y + (r * h) / rows}
            width={w / n - 3}
            height={h / rows - 3}
            rx="2"
            fill={p.dark}
            opacity={0.82 - (r % 2) * 0.08}
          />
        );
      }
    }
    return cells;
  };
  return (
    <g>
      <Sun cx={70} cy={54} r={24} color={p.sun} />
      <g>{wall(52, 120, 120, 76, 4)}</g>
      <g>{wall(196, 104, 152, 92, 5)}</g>
      <rect x="150" y="88" width="44" height="108" fill={p.dark} opacity="0.9" />
      <rect x="146" y="82" width="52" height="10" rx="3" fill={p.dark} />
      <g fill={p.accent}>
        <circle cx="120" cy="150" r="3.2" className="k-rise" />
        <circle cx="240" cy="160" r="2.6" className="k-rise" style={{ animationDelay: "1.2s" }} />
        <circle cx="280" cy="140" r="3" className="k-rise" style={{ animationDelay: "2.6s" }} />
        <circle cx="180" cy="170" r="2.4" className="k-rise" style={{ animationDelay: "3.4s" }} />
      </g>
    </g>
  );
}

function Fresque({ p }: { p: Palette }) {
  const zig = "M76 96 l10 8 l10 -8 l10 8 l10 -8";
  return (
    <g>
      <rect x="56" y="60" width="288" height="136" rx="6" fill={p.groundA} />
      <rect x="56" y="60" width="288" height="136" rx="6" fill="none" stroke={p.dark} strokeWidth="3" opacity="0.5" />
      <path d="M170 196 v-40 q30 -26 60 0 v40 Z" fill={p.dark} />
      <g stroke={p.dark} strokeWidth="4" fill="none" strokeLinecap="round">
        <path d={zig} className="k-step-1" />
        <circle cx="100" cy="150" r="11" className="k-step-2" />
        <path d="M300 90 l-14 10 l14 10" className="k-step-3" />
        <path d="M296 160 q-12 -14 -24 0 q12 14 24 0 Z" className="k-step-4" />
        <path d="M130 128 l8 -10 l8 10 l8 -10 l8 10" className="k-step-3" />
        <circle cx="238" cy="86" r="9" className="k-step-1" />
      </g>
      <g fill={p.accent}>
        <circle cx="330" cy="186" r="3.4" className="k-rise" />
        <circle cx="70" cy="80" r="2.8" className="k-rise" style={{ animationDelay: "2s" }} />
      </g>
    </g>
  );
}

function Baobab({ p }: { p: Palette }) {
  return (
    <g>
      <Sun cx={330} cy={56} r={26} color={p.sun} />
      <Birds color={p.dark} />
      <path d="M176 210 q-6 -60 -10 -92 q28 14 62 -2 q-8 36 -14 94 Z" fill={p.dark} />
      <g stroke={p.dark} strokeWidth="7" strokeLinecap="round" fill="none" className="k-sway">
        <path d="M172 122 q-34 -18 -52 -44" />
        <path d="M226 120 q30 -20 44 -48" />
        <path d="M198 116 q0 -26 4 -38" />
      </g>
      <g fill={p.accent} opacity="0.9">
        <circle cx="116" cy="72" r="18" className="k-float" />
        <circle cx="272" cy="66" r="20" className="k-float" style={{ animationDelay: "1.2s" }} />
        <circle cx="200" cy="62" r="22" className="k-float" style={{ animationDelay: "0.6s" }} />
      </g>
      <g fill={p.accent}>
        <ellipse cx="150" cy="180" rx="5" ry="2.4" className="k-rise" style={{ animationDirection: "reverse" }} />
        <ellipse cx="240" cy="190" rx="5" ry="2.4" className="k-rise" style={{ animationDirection: "reverse", animationDelay: "2.2s" }} />
      </g>
    </g>
  );
}

function Balafon({ p }: { p: Palette }) {
  const bars = [0, 1, 2, 3, 4];
  return (
    <g transform="translate(0,14)">
      <Stars count={10} />
      {bars.map((i) => (
        <circle key={i} cx={112 + i * 44} cy={190} r={16 - Math.abs(i - 2) * 2} fill={p.dark} opacity="0.9" />
      ))}
      {bars.map((i) => (
        <rect key={i} x={92 + i * 44} y={150 - Math.abs(i - 2) * 6} width={36} height={13} rx="4" fill={p.accent} stroke={p.dark} strokeWidth="2.4" className="k-bob" style={{ animationDelay: `${i * 0.18}s` }} />
      ))}
      <path d="M92 152 L312 146" stroke={p.sun} strokeWidth="2.6" />
      <g className="k-swing" style={{ transformOrigin: "120px 90px" }}>
        <line x1="120" y1="90" x2="138" y2="128" stroke={p.sun} strokeWidth="4" strokeLinecap="round" />
        <circle cx="140" cy="132" r="7" fill={p.sun} />
      </g>
      <g className="k-swing" style={{ transformOrigin: "290px 84px", animationDelay: "0.7s" }}>
        <line x1="290" y1="84" x2="272" y2="122" stroke={p.sun} strokeWidth="4" strokeLinecap="round" />
        <circle cx="270" cy="126" r="7" fill={p.sun} />
      </g>
      <g fill={p.sun} opacity="0.85">
        <circle cx="180" cy="70" r="3.4" className="k-rise" />
        <circle cx="220" cy="64" r="2.8" className="k-rise" style={{ animationDelay: "1.3s" }} />
        <circle cx="250" cy="74" r="3" className="k-rise" style={{ animationDelay: "2.6s" }} />
      </g>
    </g>
  );
}

function Tamtam({ p }: { p: Palette }) {
  return (
    <g>
      <Sun cx={76} cy={58} r={24} color={p.sun} />
      <Birds color={p.dark} />
      <g stroke={p.accent} fill="none" strokeLinecap="round">
        <path d="M118 96 q-16 -18 0 -36" strokeWidth="3.4" className="k-glow" />
        <path d="M134 104 q-24 -26 0 -52" strokeWidth="3" className="k-glow" style={{ animationDelay: "0.7s" }} />
        <path d="M150 112 q-32 -34 0 -68" strokeWidth="2.6" className="k-glow" style={{ animationDelay: "1.4s" }} />
      </g>
      <g className="k-beat">
        <ellipse cx="228" cy="104" rx="62" ry="16" fill={p.groundA} />
        <path d="M166 104 q10 56 20 66 h84 q10 -10 20 -66 Z" fill={p.dark} />
        <ellipse cx="228" cy="104" rx="62" ry="16" fill={p.groundA} />
        <ellipse cx="228" cy="104" rx="44" ry="10" fill={p.groundB} />
        <path d="M170 118 L286 126 M174 136 L282 144 M180 152 L276 158" stroke={p.accent} strokeWidth="3" opacity="0.85" />
      </g>
      <g className="k-sway" style={{ transformOrigin: "300px 60px" }}>
        <line x1="300" y1="60" x2="272" y2="96" stroke={p.sun} strokeWidth="4.6" strokeLinecap="round" />
      </g>
      <g fill={p.sun}>
        <circle cx="330" cy="120" r="3.4" className="k-rise" />
        <circle cx="348" cy="140" r="2.8" className="k-rise" style={{ animationDelay: "1.6s" }} />
      </g>
    </g>
  );
}

function Puits({ p }: { p: Palette }) {
  return (
    <g>
      <Stars count={16} />
      <Sun cx={340} cy={54} r={20} color={p.sun} glow={false} />
      <ellipse cx="210" cy="182" rx="74" ry="18" fill={p.dark} />
      <ellipse cx="210" cy="176" rx="74" ry="18" fill={p.groundA} />
      <ellipse cx="210" cy="176" rx="52" ry="11" fill={p.dark} />
      <path d="M164 176 L196 96 M256 176 L224 96" stroke={p.dark} strokeWidth="8" strokeLinecap="round" />
      <circle cx="210" cy="98" r="7" fill={p.accent} />
      <g className="k-float" style={{ animationDuration: "4.4s" }}>
        <line x1="210" y1="98" x2="210" y2="138" stroke={p.sun} strokeWidth="2.6" />
        <rect x="198" y="138" width="24" height="18" rx="3" fill={p.groundB} stroke={p.sun} strokeWidth="2" />
      </g>
      <g fill={p.accent}>
        <circle cx="120" cy="120" r="2.6" className="k-blink" />
        <circle cx="308" cy="140" r="2.2" className="k-blink" style={{ animationDelay: "2s" }} />
        <circle cx="90" cy="170" r="2" className="k-blink" style={{ animationDelay: "3.4s" }} />
      </g>
    </g>
  );
}

function Dune({ p }: { p: Palette }) {
  return (
    <g>
      <Sun cx={320} cy={64} r={30} color={p.sun} />
      <Birds color={p.dark} />
      <g stroke={p.dark} opacity="0.35" strokeLinecap="round" className="k-dash-move" strokeWidth="2.6" fill="none">
        <path d="M60 120 h90 M120 142 h110 M40 160 h80" />
      </g>
      <path d="M0 168 Q110 120 220 164 T400 150 L400 240 L0 240 Z" fill={p.groundA} />
      <path d="M0 196 Q140 156 260 196 T400 188 L400 240 L0 240 Z" fill={p.groundB} />
      <g transform="translate(86,120)">
      <g className="k-float" style={{ animationDuration: "8s" }}>
        <path d="M0 52 v-30 M0 30 q-16 -8 -22 -20 M0 28 q14 -8 20 -22 M0 34 q-6 -14 -2 -24" stroke={p.dark} strokeWidth="4" fill="none" strokeLinecap="round" />
      </g>
      </g>
    </g>
  );
}

function Enfant({ p }: { p: Palette }) {
  return (
    <g>
      <Stars count={16} />
      <Sun cx={344} cy={50} r={16} color={p.sun} glow={false} />
      <path d="M318 214 q-4 -50 -8 -74 q20 8 40 -2 q-6 28 -10 76 Z" fill={p.dark} />
      <g stroke={p.dark} strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M312 142 q-18 -10 -26 -26 M350 138 q16 -12 22 -30" />
      </g>
      <g transform="translate(150,168)">
        <circle cx="0" cy="-22" r="11" fill={p.dark} />
        <path d="M-12 24 q-2 -30 12 -34 q14 2 14 22 l-2 12 Z" fill={p.accent} />
        <path d="M-14 26 h30" stroke={p.dark} strokeWidth="6" strokeLinecap="round" />
      </g>
      <g className="k-glow">
        <path d="M232 210 q-8 -18 4 -28 q2 10 10 12 q8 -12 4 -22 q14 12 6 30 q-6 12 -24 8 Z" fill={p.sun} />
      </g>
      <rect x="218" y="212" width="44" height="5" rx="2.4" fill={p.dark} />
      <g fill={p.sun}>
        <circle cx="120" cy="120" r="2.6" className="k-rise" />
        <circle cx="270" cy="110" r="2.4" className="k-rise" style={{ animationDelay: "1.8s" }} />
        <circle cx="200" cy="90" r="2" className="k-rise" style={{ animationDelay: "3s" }} />
      </g>
    </g>
  );
}

export default function StoryArt({
  theme,
  className,
  ariaLabel,
}: {
  theme: string;
  className?: string;
  ariaLabel?: string;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const key = THEMES_VALIDES.includes(theme) ? theme : "masque";
  const p = PALETTES[key];
  return (
    <svg
      viewBox="0 0 400 240"
      className={className}
      role="img"
      aria-label={ariaLabel ?? "Illustration animée du récit"}
      preserveAspectRatio="xMidYMax slice"
    >
      <defs>
        <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.skyFrom} />
          <stop offset="100%" stopColor={p.skyTo} />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill={`url(#sky-${uid})`} />
      {(key === "enfant" || key === "puits" || key === "balafon") && <Stars />}
      {key !== "hippo" && key !== "crocodile" && <Ground a={p.groundA} b={p.groundB} />}

      {key === "cheval" && <Cheval p={p} />}
      {key === "tamtam" && <Tamtam p={p} />}
      {key === "masque" && <Masque p={p} />}
      {key === "mosquee" && <Mosquee p={p} />}
      {key === "pierre" && <Pierre p={p} />}
      {key === "hippo" && (
        <>
          <Water a={p.groundA} b={p.groundB} />
          <Hippo p={p} />
        </>
      )}
      {key === "balafon" && <Balafon p={p} />}
      {key === "baobab" && <Baobab p={p} />}
      {key === "enfant" && <Enfant p={p} />}
      {key === "crocodile" && <Crocodile p={p} />}
      {key === "fresque" && <Fresque p={p} />}
      {key === "elephant" && <Elephant p={p} />}
      {key === "dune" && <Dune p={p} />}
      {key === "puits" && <Puits p={p} />}
    </svg>
  );
}
