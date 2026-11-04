"use client";

// Scène animée d'un récit, façon théâtre d'ombres.
// Le récit est découpé en tableaux (voir plan.ts). Le tableau affiché suit :
//   1. la lecture en français (paragraphe en cours),
//   2. sinon l'enregistrement en langue locale (position dans l'audio),
//   3. sinon la position de lecture dans le texte (défilement).

import { memo, useSyncExternalStore, type ReactElement } from "react";
import type { Setting, Tableau, TimeOfDay } from "./plan";
import { SILHOUETTES, AQUATIC, FLYING, SMALL } from "./Silhouettes";

const W = 1200;
const H = 300;
const GROUND = 262;
const SHADOW = "#1d120c";

const SKY: Record<TimeOfDay, [string, string, string]> = {
  jour: ["#eea85a", "#f6cd8a", "#fbe8c4"],
  soir: ["#7e2f2a", "#d9693a", "#f4bb62"],
  nuit: ["#11163a", "#3a3466", "#8a6f9c"],
};
const HILLS: Record<TimeOfDay, string> = { jour: "#c4844a", soir: "#8f3d2c", nuit: "#4a3d6a" };

// Petit écran : on resserre le cadre pour que les personnages restent lisibles
const MQ = "(max-width: 640px)";
function subscribe(cb: () => void) {
  const m = window.matchMedia(MQ);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
}
function useCompact(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(MQ).matches,
    () => false
  );
}

// --- Décors -----------------------------------------------------------------

const hut = (x: number, s = 1, key?: string) => (
  <g key={key ?? `hut-${x}`} transform={`translate(${x} ${GROUND}) scale(${s})`}>
    <rect x={-38} y={-52} width={76} height={52} rx={6} />
    <path d="M-50 -46 L0 -104 L50 -46 Z" />
    <path d="M0 -104 L0 -114" stroke="currentColor" strokeWidth={3} />
  </g>
);

const granary = (x: number, s = 1) => (
  <g key={`gr-${x}`} transform={`translate(${x} ${GROUND}) scale(${s})`}>
    <rect x={-16} y={-14} width={4} height={14} />
    <rect x={12} y={-14} width={4} height={14} />
    <rect x={-22} y={-58} width={44} height={46} rx={14} />
    <path d="M-28 -52 L0 -86 L28 -52 Z" />
  </g>
);

const acacia = (x: number, s = 1) => (
  <g key={`ac-${x}`} transform={`translate(${x} ${GROUND}) scale(${s})`}>
    <path d="M-4 0 L-2 -70 L-30 -96 M-2 -70 L28 -100 M-2 -80 L4 -104" stroke="currentColor" strokeWidth={7} fill="none" strokeLinecap="round" />
    <g className="ks-sway">
      <ellipse cx={0} cy={-108} rx={74} ry={16} />
      <ellipse cx={-30} cy={-100} rx={30} ry={10} />
      <ellipse cx={34} cy={-102} rx={30} ry={10} />
    </g>
  </g>
);

const baobab = (x: number, s = 1) => (
  <g key={`bb-${x}`} transform={`translate(${x} ${GROUND}) scale(${s})`}>
    <path d="M-34 0 Q-28 -60 -22 -118 L22 -118 Q28 -60 34 0 Z" />
    <path
      d="M-18 -116 L-46 -150 M-8 -118 L-20 -164 M4 -118 L10 -168 M16 -116 L44 -152 M20 -110 L58 -128 M-20 -110 L-60 -126"
      stroke="currentColor"
      strokeWidth={9}
      strokeLinecap="round"
    />
    <g className="ks-sway">
      <circle cx={-46} cy={-154} r={11} />
      <circle cx={-20} cy={-168} r={12} />
      <circle cx={10} cy={-172} r={12} />
      <circle cx={44} cy={-156} r={11} />
      <circle cx={60} cy={-130} r={9} />
      <circle cx={-62} cy={-128} r={9} />
    </g>
  </g>
);

const palace = (x: number) => (
  <g key={`pal-${x}`} transform={`translate(${x} ${GROUND})`}>
    <rect x={-150} y={-62} width={300} height={62} />
    {[-140, -100, -60, 60, 100, 140].map((px) => (
      <path key={px} d={`M${px - 8} -62 L${px} -82 L${px + 8} -62 Z`} />
    ))}
    <rect x={-40} y={-120} width={80} height={120} />
    {[-30, -10, 10, 30].map((px) => (
      <path key={px} d={`M${px - 6} -120 L${px} -146 L${px + 6} -120 Z`} />
    ))}
    {[-28, -6, 16].map((px) => (
      <rect key={px} x={px} y={-104} width={4} height={20} />
    ))}
  </g>
);

const parasol = (x: number) => (
  <g key={`par-${x}`} transform={`translate(${x} ${GROUND})`}>
    <path d="M0 0 L0 -128" stroke="currentColor" strokeWidth={4} />
    <path d="M-44 -118 Q0 -150 44 -118 Z" />
    <path d="M-44 -118 L-44 -108 M-22 -122 L-22 -112 M0 -124 L0 -114 M22 -122 L22 -112 M44 -118 L44 -108" stroke="currentColor" strokeWidth={3} />
  </g>
);

const needles = (x: number, s = 1) => (
  <g key={`nd-${x}`} transform={`translate(${x} ${GROUND}) scale(${s})`}>
    <path d="M-80 0 Q-74 -90 -62 -150 Q-52 -90 -44 0 Z" />
    <path d="M-48 0 Q-40 -70 -30 -112 Q-20 -60 -14 0 Z" />
    <path d="M-20 0 Q-10 -110 4 -176 Q16 -100 22 0 Z" />
    <path d="M16 0 Q26 -70 38 -120 Q48 -70 54 0 Z" />
    <path d="M48 0 Q56 -50 66 -84 Q74 -40 82 0 Z" />
  </g>
);

const reeds = (x: number) => (
  <g key={`rd-${x}`} transform={`translate(${x} ${GROUND})`} className="ks-sway">
    {[-14, -6, 2, 10, 18].map((dx, i) => (
      <path key={dx} d={`M${dx} 0 Q${dx + 2} -30 ${dx + (i % 2 ? 6 : -4)} -${46 + i * 6}`} stroke="currentColor" strokeWidth={3} fill="none" />
    ))}
  </g>
);

const shrub = (x: number) => (
  <g key={`sh-${x}`} transform={`translate(${x} ${GROUND})`}>
    <path d="M0 0 L-14 -26 M0 0 L0 -32 M0 0 L14 -24 M-7 -14 L-18 -16 M7 -14 L18 -18" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
  </g>
);

function SettingProps({ setting }: { setting: Setting }): ReactElement {
  switch (setting) {
    case "village":
      return <>{[hut(150, 1.05), granary(268, 0.95), hut(1010, 0.95), hut(1120, 0.8), acacia(60, 0.8)]}</>;
    case "veillee":
      return <>{[hut(160, 1), granary(280, 0.85), baobab(1030, 0.95)]}</>;
    case "brousse":
      return <>{[acacia(150, 1.1), acacia(1060, 0.9), shrub(300), shrub(920), acacia(1180, 0.6)]}</>;
    case "sahel":
      return <>{[shrub(160), shrub(250), acacia(1040, 0.75), shrub(930)]}</>;
    case "eau":
      return <>{[reeds(120), reeds(220), acacia(1080, 0.9), reeds(960)]}</>;
    case "palais":
      return <>{[palace(170), parasol(1010), hut(1130, 0.8)]}</>;
    case "arbre":
      return <>{[baobab(180, 1.05), hut(1060, 0.85), shrub(960)]}</>;
    case "rochers":
      return <>{[needles(150, 1), needles(1080, 0.85)]}</>;
  }
}

// --- Personnages ------------------------------------------------------------

function slots(n: number, setting: Setting, compact: boolean): number[] {
  if (setting === "veillee") return compact ? [500, 690, 740] : [470, 730, 800];
  if (n <= 1) return [600];
  if (n === 2) return compact ? [530, 680] : [505, 705];
  return compact ? [470, 600, 730] : [420, 600, 785];
}

const CHAR_SCALE = 0.86;

function Characters({ tb, water, compact }: { tb: Tableau; water: boolean; compact: boolean }) {
  const ground = tb.characters.filter((c) => !FLYING.includes(c));
  const flyers = tb.characters.filter((c) => FLYING.includes(c));
  const xs = slots(ground.length, tb.setting, compact);
  const moving = tb.motion !== "pose";

  const figures = ground.map((id, i) => {
    const Draw = SILHOUETTES[id];
    const inWater = water && AQUATIC.includes(id);
    const y = inWater ? GROUND + 24 : GROUND;
    const s = CHAR_SCALE * (SMALL[id] ?? 1);
    // face à face quand ils sont immobiles, tous vers la droite quand ils avancent
    const flip =
      !moving &&
      ground.length > 1 &&
      (tb.setting === "veillee" ? id !== "conteur" : i >= ground.length / 2);
    const x = moving ? 600 + (i - (ground.length - 1) / 2) * 95 : xs[i];
    return (
      <g key={`${id}-${i}`} transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
        <g className={moving ? (tb.motion === "fuite" ? "ks-step-fast" : "ks-step") : "ks-bob"} style={{ animationDelay: `${i * 0.37}s` }}>
          <Draw />
        </g>
      </g>
    );
  });

  return (
    <g>
      {moving ? <g className={tb.motion === "fuite" ? "ks-run" : "ks-walk"}>{figures}</g> : figures}
      {flyers.map((id, i) => {
        const Draw = SILHOUETTES[id];
        return (
          <g key={`fly-${i}`} transform={`translate(0 ${100 + i * 26}) scale(1.3)`}>
            <g className="ks-fly" style={{ animationDelay: `${-i * 6}s` }}>
              <Draw />
            </g>
          </g>
        );
      })}
    </g>
  );
}

// --- Ciel, eau, effets -------------------------------------------------------

const STARS = Array.from({ length: 34 }, (_, i) => ({
  x: (i * 263) % W,
  y: 14 + ((i * 97) % 120),
  r: i % 5 === 0 ? 1.8 : 1.1,
  d: (i % 7) * 0.4,
}));

function Fire({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} ${GROUND})`}>
      <circle cx={0} cy={-16} r={46} fill="url(#ks-glow)" />
      <path d="M-18 0 L18 -6 M-16 -6 L16 0" stroke={SHADOW} strokeWidth={5} strokeLinecap="round" />
      <g className="ks-flicker">
        <path d="M-12 -4 Q-14 -24 -2 -40 Q0 -26 6 -30 Q14 -18 12 -4 Z" fill="#f08a2c" />
        <path d="M-6 -4 Q-6 -18 0 -26 Q6 -16 6 -4 Z" fill="#ffd36b" />
      </g>
    </g>
  );
}

interface Props {
  tableaux: Tableau[];
  index: number;
  className?: string;
}

function StoryScene({ tableaux, index, className }: Props) {
  const compact = useCompact();
  const tb = tableaux[Math.max(0, Math.min(index, tableaux.length - 1))];
  const water = tb.setting === "eau";
  const day = tb.time !== "nuit";
  const fireX = tb.setting === "veillee" ? 600 : compact ? 790 : 880;

  return (
    <svg
      viewBox={compact ? "250 110 700 190" : `0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMax slice"
      className={`ks-scene ${className ?? ""}`}
      role="img"
      aria-label="Illustration animée du récit"
    >
      <defs>
        {(Object.keys(SKY) as TimeOfDay[]).map((t) => (
          <linearGradient key={t} id={`ks-sky-${t}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={SKY[t][0]} />
            <stop offset="0.55" stopColor={SKY[t][1]} />
            <stop offset="1" stopColor={SKY[t][2]} />
          </linearGradient>
        ))}
        <radialGradient id="ks-glow">
          <stop offset="0" stopColor="#ffb347" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffb347" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ks-sun">
          <stop offset="0" stopColor="#fff4d6" />
          <stop offset="0.6" stopColor="#ffe08a" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffe08a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ciel : les trois ciels se fondent l'un dans l'autre */}
      {(Object.keys(SKY) as TimeOfDay[]).map((t) => (
        <rect key={t} width={W} height={H} fill={`url(#ks-sky-${t})`} className="ks-sky" style={{ opacity: tb.time === t ? 1 : 0 }} />
      ))}

      {/* astre */}
      {tb.time === "jour" && <circle cx={930} cy={96} r={58} fill="url(#ks-sun)" className="ks-fade" key="sun" />}
      {tb.time === "soir" && <circle cx={960} cy={214} r={70} fill="url(#ks-sun)" className="ks-fade" key="dusk" />}
      {tb.time === "nuit" && (
        <g className="ks-fade" key="night">
          {STARS.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff6dc" className="ks-twinkle" style={{ animationDelay: `${s.d}s` }} />
          ))}
          <circle cx={950} cy={70} r={22} fill="#fff1c9" />
          <circle cx={960} cy={64} r={20} fill={SKY.nuit[0]} opacity={0.9} />
        </g>
      )}

      {/* collines lointaines */}
      <path
        d={
          tb.setting === "sahel"
            ? "M0 230 Q160 196 330 222 Q520 246 700 214 Q900 186 1200 224 L1200 300 L0 300 Z"
            : "M0 226 Q120 186 260 210 Q420 236 560 200 Q720 168 880 206 Q1040 238 1200 200 L1200 300 L0 300 Z"
        }
        fill={HILLS[tb.time]}
        opacity={0.55}
        className="ks-sky"
      />

      {/* oiseaux de passage le jour */}
      {day && tb.setting !== "veillee" && (
        <g color={SHADOW} opacity={0.55}>
          <g transform="translate(0 70) scale(0.6)">
            <g className="ks-fly" style={{ animationDuration: "28s" }}>
              {SILHOUETTES.oiseau()}
            </g>
          </g>
          <g transform="translate(0 52) scale(0.45)">
            <g className="ks-fly" style={{ animationDuration: "34s", animationDelay: "-12s" }}>
              {SILHOUETTES.oiseau()}
            </g>
          </g>
        </g>
      )}

      {/* décor */}
      <g key={`set-${index}-${tb.setting}`} color={SHADOW} fill={SHADOW} className="ks-fade" opacity={0.92}>
        <SettingProps setting={tb.setting} />
      </g>

      {/* sol */}
      <path d={`M0 ${GROUND} L${W} ${GROUND} L${W} ${H} L0 ${H} Z`} fill={SHADOW} />
      <g fill={SHADOW}>
        {Array.from({ length: 30 }, (_, i) => {
          const gx = 20 + i * 41;
          return <path key={i} d={`M${gx} ${GROUND + 1} l3 -9 l2 9 l4 -12 l2 12 l3 -8 l2 8 Z`} />;
        })}
      </g>

      {/* eau */}
      {water && (
        <g key={`water-${index}`} className="ks-fade">
          <rect x={0} y={GROUND + 10} width={W} height={H - GROUND - 10} fill="#3f5f74" opacity={0.85} />
          <g className="ks-ripple" stroke="#a9c7d6" strokeWidth={2} strokeLinecap="round" opacity={0.7}>
            {Array.from({ length: 22 }, (_, i) => (
              <path key={i} d={`M${i * 62} ${GROUND + 20 + (i % 3) * 7} h24`} />
            ))}
          </g>
        </g>
      )}

      {/* feu de veillée */}
      {tb.fire && tb.time !== "jour" && <Fire x={fireX} />}

      {/* personnages */}
      <g key={`chars-${index}`} color={SHADOW} fill={SHADOW} className="ks-enter">
        <Characters tb={tb} water={water} compact={compact} />
      </g>

      {/* pluie */}
      {tb.rain && (
        <g className="ks-rain" stroke="#dfe9f2" strokeWidth={1.6} opacity={0.6}>
          {Array.from({ length: 60 }, (_, i) => (
            <path key={i} d={`M${(i * 97) % W} ${(i * 53) % 240} l-5 16`} />
          ))}
        </g>
      )}
    </svg>
  );
}

export default memo(StoryScene);
