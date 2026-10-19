import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
} as const;

export const ExternalIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M8 16 16 8M9.5 8H16v6.5" />
  </svg>
);
export const ArrowLeftIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);
export const ArrowRightIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const CopyIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="8.5" y="8.5" width="11" height="11" rx="2.5" />
    <path d="M15.5 8.5V6.5a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2" />
  </svg>
);
export const CheckIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);
export const SearchIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </svg>
);
export const SunIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
  </svg>
);
export const MoonIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
  </svg>
);
export const SoundOnIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
    <path d="M15.5 9a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11" />
  </svg>
);
export const SoundOffIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
    <path d="m16 9.5 5 5M21 9.5l-5 5" />
  </svg>
);
export const PlayIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M8 5.5v13l10-6.5z" fill="currentColor" stroke="none" />
  </svg>
);
export const MailIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);
export const PinIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </svg>
);
export const MenuIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 8h16M4 16h16" />
  </svg>
);
export const CloseIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const ExpandIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
  </svg>
);
export const ShrinkIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
  </svg>
);
export const CornerIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M9 10 4 15l5 5" />
    <path d="M20 4v7a4 4 0 0 1-4 4H4" />
  </svg>
);
export const Spinner = (p: IconProps) => (
  <svg {...base} {...p} className={`animate-spin ${p.className ?? ""}`}>
    <path d="M12 3a9 9 0 1 0 9 9" />
  </svg>
);

export const GitHubIcon = (p: IconProps) => (
  <svg {...base} fill="currentColor" stroke="none" {...p}>
    <path d="M12 2.25c-5.39 0-9.75 4.37-9.75 9.76 0 4.31 2.8 7.97 6.67 9.26.49.09.67-.21.67-.47v-1.65c-2.71.59-3.29-1.31-3.29-1.31-.44-1.13-1.08-1.43-1.08-1.43-.89-.6.07-.59.07-.59.98.07 1.5 1.01 1.5 1.01.87 1.5 2.29 1.07 2.85.82.09-.63.34-1.07.62-1.31-2.17-.25-4.44-1.08-4.44-4.82 0-1.07.38-1.94 1.01-2.62-.1-.25-.44-1.24.1-2.59 0 0 .82-.26 2.68 1a9.3 9.3 0 0 1 4.88 0c1.86-1.26 2.68-1 2.68-1 .53 1.35.2 2.34.1 2.59.63.68 1.01 1.55 1.01 2.62 0 3.75-2.28 4.57-4.45 4.81.35.3.66.9.66 1.81v2.68c0 .26.18.57.68.47a9.77 9.77 0 0 0 6.66-9.26c0-5.39-4.37-9.76-9.75-9.76Z" />
  </svg>
);
export const LinkedInIcon = (p: IconProps) => (
  <svg {...base} fill="currentColor" stroke="none" {...p}>
    <path d="M19.67 2.5H4.33A1.83 1.83 0 0 0 2.5 4.33v15.34c0 1.01.82 1.83 1.83 1.83h15.34c1.01 0 1.83-.82 1.83-1.83V4.33c0-1.01-.82-1.83-1.83-1.83ZM8.14 18.69H5.31V9.57h2.83v9.12ZM6.72 8.33a1.64 1.64 0 1 1 0-3.28 1.64 1.64 0 0 1 0 3.28Zm11.97 10.36h-2.83v-4.44c0-1.06-.02-2.42-1.47-2.42-1.48 0-1.7 1.15-1.7 2.34v4.52H9.86V9.57h2.71v1.25h.04c.38-.72 1.3-1.47 2.68-1.47 2.86 0 3.39 1.88 3.39 4.33v5.01Z" />
  </svg>
);

/**
 * The brand mark: a brass plumb bob, the builder's tool for "true", with a D
 * cut clean through it. The same object hangs from the header as the theme
 * switch. `id` keeps gradient and mask ids unique when the mark appears twice.
 */
export function BrandMark({ size = 32, id = "mark", ...props }: IconProps & { size?: number; id?: string }) {
  return (
    <svg width={(size * 36) / 64} height={size} viewBox="14 0 36 64" aria-hidden focusable={false} {...props}>
      <defs>
        <linearGradient id={`${id}-l`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#fbe7ad" />
          <stop offset="1" stopColor="#d6a64a" />
        </linearGradient>
        <linearGradient id={`${id}-r`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#c18f34" />
          <stop offset="1" stopColor="#7e5718" />
        </linearGradient>
        <linearGradient id={`${id}-c`} x1="0" x2="1">
          <stop offset="0" stopColor="#a77a2a" />
          <stop offset="1" stopColor="#5f4210" />
        </linearGradient>
        <mask id={`${id}-cut`} maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64">
          <rect width="64" height="64" fill="#fff" />
          <path d="M27 26.5V41.5H31.6A7.5 7.5 0 0 0 31.6 26.5Z" fill="#000" />
        </mask>
      </defs>
      <path d="M32 1V11" stroke="var(--ink-3)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="32" cy="12.2" r="2.2" fill="none" stroke="var(--ink-3)" strokeWidth="1.6" />
      <rect x="26" y="14.5" width="12" height="5" rx="1.6" fill={`url(#${id}-c)`} />
      <rect x="24" y="19.5" width="16" height="2.5" rx="1" fill="#e9c574" />
      <g mask={`url(#${id}-cut)`}>
        <path d="M18.5 22H45.5L47.5 33L32 61L16.5 33Z" fill={`url(#${id}-r)`} />
        <path d="M18.5 22H32V61L16.5 33Z" fill={`url(#${id}-l)`} />
        <path d="M18.5 22 16.5 33 32 61" fill="none" stroke="#fff6d8" strokeOpacity=".55" strokeWidth=".8" />
      </g>
    </svg>
  );
}
