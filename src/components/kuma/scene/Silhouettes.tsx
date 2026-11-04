// Personnages du théâtre d'ombres.
// Chaque silhouette est dessinée tournée vers la droite, les pieds au point (0, 0),
// en unités de la scène (le sol est à y = 0, le haut est négatif).
// La couleur vient de « currentColor » : la scène choisit la teinte d'ombre.

import type { ReactElement } from "react";
import type { CharacterId } from "./plan";

type Draw = () => ReactElement;

const leg = (x: number, h: number, w = 6, y0 = 0) => <rect x={x} y={y0 - h} width={w} height={h} rx={w / 2} />;

const Lievre: Draw = () => (
  <g>
    <ellipse cx={-2} cy={-22} rx={26} ry={17} />
    <ellipse cx={-12} cy={-9} rx={15} ry={9} />
    <rect x={14} y={-14} width={5} height={14} rx={2.5} />
    <circle cx={24} cy={-38} r={11} />
    <ellipse cx={33} cy={-35} rx={7} ry={5} />
    <ellipse cx={18} cy={-62} rx={5} ry={19} transform="rotate(-18 18 -62)" />
    <ellipse cx={26} cy={-61} rx={4.5} ry={18} transform="rotate(8 26 -61)" />
    <circle cx={-28} cy={-28} r={6} />
  </g>
);

const Hyene: Draw = () => (
  <g>
    <ellipse cx={0} cy={-46} rx={40} ry={19} transform="rotate(-12 0 -46)" />
    {leg(22, 44, 7)}
    {leg(31, 44, 7)}
    {leg(-30, 34, 7)}
    {leg(-21, 34, 7)}
    <path d="M28 -62 L46 -74 L58 -64 L40 -50 Z" />
    <ellipse cx={56} cy={-66} rx={15} ry={11} />
    <ellipse cx={70} cy={-61} rx={11} ry={6.5} />
    <circle cx={48} cy={-79} r={6} />
    <path d="M-30 -48 Q-44 -40 -46 -26" stroke="currentColor" strokeWidth={5} fill="none" strokeLinecap="round" />
    <path d="M-14 -62 L-8 -70 L-2 -62 L4 -72 L10 -62 L16 -74 L22 -62 Z" />
  </g>
);

const Lion: Draw = () => (
  <g>
    <ellipse cx={0} cy={-50} rx={46} ry={20} />
    {leg(24, 46, 9)}
    {leg(34, 46, 9)}
    {leg(-36, 46, 9)}
    {leg(-26, 46, 9)}
    <circle cx={50} cy={-70} r={26} />
    <ellipse cx={64} cy={-64} rx={15} ry={12} />
    <path d="M-44 -54 Q-64 -60 -66 -36" stroke="currentColor" strokeWidth={4.5} fill="none" strokeLinecap="round" />
    <circle cx={-66} cy={-34} r={6} />
  </g>
);

const Chien: Draw = () => (
  <g>
    <ellipse cx={0} cy={-36} rx={30} ry={12} />
    {leg(16, 32, 6)}
    {leg(24, 32, 6)}
    {leg(-26, 32, 6)}
    {leg(-18, 32, 6)}
    <path d="M22 -42 L34 -56 L42 -46 Z" />
    <ellipse cx={38} cy={-55} rx={12} ry={10} />
    <ellipse cx={50} cy={-52} rx={9} ry={5.5} />
    <path d="M32 -62 L36 -76 L42 -62 Z" />
    <path d="M-28 -40 Q-40 -52 -36 -66" stroke="currentColor" strokeWidth={5} fill="none" strokeLinecap="round" />
  </g>
);

const Chat: Draw = () => (
  <g>
    <ellipse cx={0} cy={-22} rx={20} ry={9} />
    {leg(10, 20, 4.5)}
    {leg(16, 20, 4.5)}
    {leg(-17, 20, 4.5)}
    {leg(-11, 20, 4.5)}
    <circle cx={22} cy={-34} r={9} />
    <path d="M16 -40 L17 -50 L23 -42 Z M24 -42 L29 -50 L30 -40 Z" />
    <path d="M-18 -24 Q-32 -30 -28 -48 Q-26 -54 -22 -52" stroke="currentColor" strokeWidth={4} fill="none" strokeLinecap="round" />
  </g>
);

const Poule: Draw = () => (
  <g>
    <ellipse cx={0} cy={-22} rx={18} ry={14} />
    <path d="M-14 -26 L-30 -46 L-24 -22 Z" />
    <circle cx={14} cy={-40} r={8} />
    <path d="M21 -42 L29 -39 L21 -36 Z" />
    <circle cx={12} cy={-49} r={3.5} />
    <circle cx={16} cy={-48} r={3} />
    <path d="M-3 -9 L-5 0 M5 -9 L4 0" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" />
  </g>
);

const Elephant: Draw = () => (
  <g>
    <ellipse cx={0} cy={-78} rx={68} ry={44} />
    {leg(-56, 56, 20)}
    {leg(-30, 56, 20)}
    {leg(22, 56, 20)}
    {leg(44, 56, 20)}
    <circle cx={70} cy={-92} r={30} />
    <ellipse cx={52} cy={-90} rx={22} ry={30} />
    <path d="M90 -96 Q112 -70 104 -36 Q102 -26 110 -22" stroke="currentColor" strokeWidth={14} fill="none" strokeLinecap="round" />
    <path d="M-66 -86 Q-80 -70 -76 -54" stroke="currentColor" strokeWidth={4} fill="none" strokeLinecap="round" />
  </g>
);

const Hippo: Draw = () => (
  <g>
    <ellipse cx={0} cy={-38} rx={60} ry={30} />
    {leg(-46, 22, 16)}
    {leg(-24, 22, 16)}
    {leg(20, 22, 16)}
    {leg(38, 22, 16)}
    <ellipse cx={60} cy={-46} rx={28} ry={20} />
    <ellipse cx={78} cy={-38} rx={18} ry={16} />
    <circle cx={54} cy={-66} r={6} />
    <circle cx={66} cy={-64} r={5} />
  </g>
);

const Crocodile: Draw = () => (
  <g>
    <path d="M-96 -6 Q-60 -14 -20 -16 L60 -16 Q90 -14 104 -8 Q90 -4 60 -6 L-20 -4 Q-60 -2 -96 -6 Z" />
    <path d="M-40 -16 l6 -7 l6 7 M-20 -16 l6 -8 l6 8 M0 -16 l6 -8 l6 8 M20 -16 l6 -7 l6 7" />
    {leg(-30, 8, 7, 0)}
    {leg(30, 8, 7, 0)}
    <circle cx={64} cy={-19} r={4} />
  </g>
);

const Cheval: Draw = () => (
  <g>
    <ellipse cx={0} cy={-74} rx={44} ry={19} />
    {leg(26, 62, 7)}
    {leg(34, 62, 7)}
    {leg(-36, 62, 7)}
    {leg(-27, 62, 7)}
    <path d="M28 -84 Q40 -110 50 -118 L60 -110 Q50 -96 42 -70 Z" />
    <ellipse cx={62} cy={-112} rx={18} ry={8.5} transform="rotate(32 62 -112)" />
    <path d="M48 -120 L50 -130 L55 -120 Z" />
    <path d="M30 -88 Q36 -108 48 -118" stroke="currentColor" strokeWidth={6} fill="none" />
    <path d="M-42 -80 Q-58 -76 -56 -46" stroke="currentColor" strokeWidth={7} fill="none" strokeLinecap="round" />
  </g>
);

const Personne = ({ wide = false, dress = false, scale = 1 }: { wide?: boolean; dress?: boolean; scale?: number }) => (
  <g transform={`scale(${scale})`}>
    <circle cx={0} cy={-86} r={9} />
    <rect x={-3} y={-78} width={6} height={6} />
    {dress ? (
      <path d="M-11 -74 L11 -74 L17 -2 L-17 -2 Z" />
    ) : (
      <>
        <path d={wide ? "M-17 -74 L17 -74 L19 -34 L-19 -34 Z" : "M-11 -74 L11 -74 L13 -38 L-13 -38 Z"} />
        {leg(-10, 40, 8)}
        {leg(2, 40, 8)}
      </>
    )}
    <path d="M10 -72 L20 -48" stroke="currentColor" strokeWidth={6} strokeLinecap="round" />
    <path d="M-10 -72 L-18 -48" stroke="currentColor" strokeWidth={6} strokeLinecap="round" />
  </g>
);

const Homme: Draw = () => <Personne />;

const Femme: Draw = () => (
  <g>
    <Personne dress />
    <ellipse cx={0} cy={-96} rx={11} ry={6} />
    <path d="M-4 -100 L-2 -110 L8 -104 Z" />
  </g>
);

const Enfant: Draw = () => <Personne scale={0.62} />;

const Roi: Draw = () => (
  <g>
    <Personne wide />
    <path d="M-10 -92 Q0 -108 10 -92 Z" />
    <rect x={-10} y={-94} width={20} height={4} />
    <path d="M24 -100 L24 0" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" />
    <circle cx={24} cy={-102} r={5} />
  </g>
);

const Reine: Draw = () => (
  <g>
    <Personne dress />
    <path d="M-9 -94 L-9 -104 L-4 -98 L0 -106 L4 -98 L9 -104 L9 -94 Z" />
  </g>
);

const Vieux: Draw = () => (
  <g>
    <g transform="rotate(12 0 -40)">
      <Personne />
    </g>
    <path d="M26 -58 L30 0" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" />
  </g>
);

const Chasseur: Draw = () => (
  <g>
    <Personne />
    <path d="M22 -96 Q40 -66 22 -36" stroke="currentColor" strokeWidth={3.5} fill="none" />
    <path d="M22 -96 L22 -36" stroke="currentColor" strokeWidth={1.2} />
    <path d="M-8 -80 L-20 -50" stroke="currentColor" strokeWidth={6} strokeLinecap="round" />
  </g>
);

const Cavaliere: Draw = () => (
  <g>
    <Cheval />
    <g transform="translate(-4 -64) scale(0.8)">
      <circle cx={0} cy={-86} r={9} />
      <path d="M-10 -76 L10 -76 L12 -40 L-12 -40 Z" />
      <path d="M-10 -42 L18 -18" stroke="currentColor" strokeWidth={8} strokeLinecap="round" />
      <path d="M10 -72 L34 -66" stroke="currentColor" strokeWidth={5} strokeLinecap="round" />
      <path d="M36 -110 L36 -30" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
      <path d="M36 -110 L32 -100 L40 -100 Z" />
      <path d="M-6 -92 Q-22 -88 -24 -74" stroke="currentColor" strokeWidth={4} fill="none" strokeLinecap="round" />
    </g>
  </g>
);

const Singe: Draw = () => (
  <g>
    <ellipse cx={0} cy={-30} rx={15} ry={22} transform="rotate(-18 0 -30)" />
    <circle cx={12} cy={-58} r={11} />
    <ellipse cx={20} cy={-55} rx={6} ry={5} />
    <path d="M8 -40 L24 -20 M-4 -16 L-6 0 M6 -14 L10 0" stroke="currentColor" strokeWidth={5} strokeLinecap="round" />
    <path d="M-12 -14 Q-36 -10 -34 -36 Q-32 -48 -22 -44" stroke="currentColor" strokeWidth={4} fill="none" strokeLinecap="round" />
  </g>
);

const Chevre: Draw = () => (
  <g>
    <ellipse cx={0} cy={-38} rx={26} ry={13} />
    {leg(14, 32, 5)}
    {leg(21, 32, 5)}
    {leg(-22, 32, 5)}
    {leg(-15, 32, 5)}
    <path d="M18 -44 L30 -60 L38 -52 Z" />
    <ellipse cx={34} cy={-58} rx={10} ry={7} transform="rotate(25 34 -58)" />
    <path d="M30 -64 Q22 -80 12 -74" stroke="currentColor" strokeWidth={3.5} fill="none" strokeLinecap="round" />
    <path d="M38 -52 L38 -44" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
    <path d="M-26 -42 L-32 -50" stroke="currentColor" strokeWidth={4} strokeLinecap="round" />
  </g>
);

const Vache: Draw = () => (
  <g>
    <ellipse cx={0} cy={-58} rx={44} ry={22} />
    <ellipse cx={22} cy={-80} rx={12} ry={9} />
    {leg(24, 46, 8)}
    {leg(33, 46, 8)}
    {leg(-36, 46, 8)}
    {leg(-26, 46, 8)}
    <ellipse cx={54} cy={-66} rx={15} ry={10} transform="rotate(30 54 -66)" />
    <path d="M48 -76 Q38 -100 52 -110 M54 -76 Q70 -98 62 -112" stroke="currentColor" strokeWidth={4} fill="none" strokeLinecap="round" />
    <path d="M-44 -60 L-48 -26" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
  </g>
);

const Antilope: Draw = () => (
  <g>
    <ellipse cx={0} cy={-56} rx={30} ry={13} />
    {leg(18, 52, 4.5)}
    {leg(24, 52, 4.5)}
    {leg(-24, 52, 4.5)}
    {leg(-18, 52, 4.5)}
    <path d="M20 -62 L34 -86 L40 -80 L30 -58 Z" />
    <ellipse cx={42} cy={-86} rx={10} ry={6} transform="rotate(25 42 -86)" />
    <path d="M36 -92 L30 -118 M40 -92 L38 -118" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
  </g>
);

const Oiseau: Draw = () => (
  <g className="ks-flap">
    <path d="M-22 -4 Q-10 -18 0 -4 Q10 -18 22 -4 Q10 -10 0 0 Q-10 -10 -22 -4 Z" />
  </g>
);

const Insecte: Draw = () => (
  <g>
    <ellipse cx={0} cy={-7} rx={10} ry={6} />
    <circle cx={10} cy={-8} r={4} />
    <path d="M-6 -3 L-10 0 M0 -2 L0 1 M6 -3 L9 0 M12 -11 L18 -16" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
  </g>
);

const Crapaud: Draw = () => (
  <g>
    <ellipse cx={0} cy={-12} rx={16} ry={11} />
    <circle cx={10} cy={-22} r={5} />
    <ellipse cx={-10} cy={-4} rx={9} ry={5} />
    <ellipse cx={10} cy={-3} rx={6} ry={3} />
  </g>
);

const Poisson: Draw = () => (
  <g>
    <ellipse cx={0} cy={-10} rx={30} ry={10} />
    <path d="M-26 -10 L-44 -22 L-40 -10 L-44 2 Z" />
    <path d="M28 -12 Q40 -6 44 4 M28 -8 Q38 -2 38 8" stroke="currentColor" strokeWidth={1.6} fill="none" />
  </g>
);

const Serpent: Draw = () => (
  <g>
    <path d="M-60 -4 Q-45 -20 -30 -4 Q-15 12 0 -4 Q15 -20 30 -4 Q38 4 46 -6" stroke="currentColor" strokeWidth={7} fill="none" strokeLinecap="round" />
    <ellipse cx={50} cy={-9} rx={8} ry={5} />
  </g>
);

const Rongeur: Draw = () => (
  <g>
    <ellipse cx={0} cy={-11} rx={16} ry={10} />
    <circle cx={14} cy={-16} r={7} />
    <circle cx={12} cy={-24} r={4} />
    <path d="M-14 -10 Q-30 -6 -34 -18" stroke="currentColor" strokeWidth={2.5} fill="none" strokeLinecap="round" />
  </g>
);

const Esprit: Draw = () => (
  <g className="ks-float" opacity={0.85}>
    <path d="M-20 -40 Q-26 -90 0 -110 Q26 -90 20 -40 Q14 -30 8 -40 Q2 -28 -4 -40 Q-10 -30 -20 -40 Z" />
    <circle cx={-6} cy={-86} r={3} className="ks-eye" />
    <circle cx={6} cy={-86} r={3} className="ks-eye" />
  </g>
);

const Masque: Draw = () => (
  <g>
    <path d="M-30 0 L-22 -70 L22 -70 L30 0 Z" />
    <path d="M-30 0 L-34 -8 M-20 0 L-22 -10 M-10 0 L-10 -10 M0 0 L0 -10 M10 0 L10 -10 M20 0 L22 -10 M30 0 L34 -8" stroke="currentColor" strokeWidth={3} />
    <rect x={-12} y={-118} width={24} height={50} rx={8} />
    <path d="M-6 -118 L-10 -150 M0 -118 L0 -156 M6 -118 L10 -150" stroke="currentColor" strokeWidth={4} strokeLinecap="round" />
  </g>
);

const Conteur: Draw = () => (
  <g>
    <circle cx={0} cy={-62} r={9} />
    <path d="M-12 -52 L12 -52 L16 -18 L-16 -18 Z" />
    <rect x={-22} y={-18} width={44} height={8} rx={3} />
    <rect x={-18} y={-10} width={5} height={10} />
    <rect x={13} y={-10} width={5} height={10} />
    <path d="M12 -48 L30 -70" stroke="currentColor" strokeWidth={6} strokeLinecap="round" className="ks-gesture" />
    <path d="M-12 -48 L-20 -26" stroke="currentColor" strokeWidth={6} strokeLinecap="round" />
  </g>
);

export const SILHOUETTES: Record<CharacterId, Draw> = {
  lievre: Lievre,
  hyene: Hyene,
  lion: Lion,
  chien: Chien,
  chat: Chat,
  poule: Poule,
  elephant: Elephant,
  hippo: Hippo,
  crocodile: Crocodile,
  cheval: Cheval,
  cavaliere: Cavaliere,
  singe: Singe,
  chevre: Chevre,
  vache: Vache,
  antilope: Antilope,
  oiseau: Oiseau,
  insecte: Insecte,
  crapaud: Crapaud,
  poisson: Poisson,
  serpent: Serpent,
  rongeur: Rongeur,
  roi: Roi,
  reine: Reine,
  femme: Femme,
  homme: Homme,
  enfant: Enfant,
  vieux: Vieux,
  chasseur: Chasseur,
  esprit: Esprit,
  masque: Masque,
  conteur: Conteur,
};

/** Personnages qui vivent dans l'eau ou au ras du sol mouillé */
export const AQUATIC: CharacterId[] = ["poisson", "crocodile"];
/** Personnages qui volent */
export const FLYING: CharacterId[] = ["oiseau"];
/** Petits personnages : on les agrandit un peu pour qu'ils restent visibles */
export const SMALL: Partial<Record<CharacterId, number>> = { insecte: 1.8, crapaud: 1.5, rongeur: 1.5, poule: 1.2, chat: 1.15, poisson: 1.4, crocodile: 1.25 };
