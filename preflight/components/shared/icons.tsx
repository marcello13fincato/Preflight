// Icona custom: logo chatbox
export function IconLogoPreflight({ size = 32, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { size?: number }) {
  return (
    <img
      src="/LOGO PREFLIGHT.png"
      alt="Logo Preflight"
      width={size}
      height={size}
      style={{ display: "inline-block", verticalAlign: "middle", ...props.style }}
      {...props}
    />
  );
}
import * as React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

function baseProps(size: number): React.SVGProps<SVGSVGElement> {
  return { width: size, height: size, viewBox: "0 0 24 24", fill: "none" };
}

export function IconCheck({ size = 20, ...props }: IconProps) {
  return (
    <svg {...baseProps(size)} {...props}>
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconSparkles({ size = 20, ...props }: IconProps) {
  return (
    <svg {...baseProps(size)} {...props}>
      <path
        d="M12 2l1.2 4.3L17.5 8 13.2 9.2 12 13.5 10.8 9.2 6.5 8l4.3-1.7L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconChart({ size = 20, ...props }: IconProps) {
  return (
    <svg {...baseProps(size)} {...props}>
      <path d="M4 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 19h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 15v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 15V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 15V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconZap({ size = 20, ...props }: IconProps) {
  return (
    <svg {...baseProps(size)} {...props}>
      <path
        d="M13 2L3 14h7v8l10-12h-7l0-8z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconEdit3({ size = 20, ...props }: IconProps) {
  return (
    <svg {...baseProps(size)} {...props}>
      <path
        d="M12 20h9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconList({ size = 20, ...props }: IconProps) {
  return (
    <svg {...baseProps(size)} {...props}>
      <path
        d="M8 6h12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 12h12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 18h12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="4" cy="6" r="1" fill="currentColor" />
      <circle cx="4" cy="12" r="1" fill="currentColor" />
      <circle cx="4" cy="18" r="1" fill="currentColor" />
    </svg>
  );
}

export function IconArrowRight({ size = 20, ...props }: IconProps) {
  return (
    <svg {...baseProps(size)} {...props}>
      <path
        d="M5 12h12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconTarget({ size = 20, ...props }: IconProps) {
  return (
    <svg {...baseProps(size)} {...props}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

export function IconCompass({ size = 20, ...props }: IconProps) {
  return (
    <svg {...baseProps(size)} {...props}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M16 8l-7 4 4 3 7-4-4-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// Ensure consistent stroke width across icons
export const ICON_STROKE = 2;

/* ── Additional icons for replacing emojis across all pages ── */

export function IconClipboard({ size = 20, ...props }: IconProps) {
  return (
    <svg {...baseProps(size)} {...props}>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function IconThermometer({ size = 20, ...props }: IconProps) {
  return (
    <svg {...baseProps(size)} {...props}>
      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconMessageCircle({ size = 20, ...props }: IconProps) {
  return (
    <svg {...baseProps(size)} {...props}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconAlertTriangle({ size = 20, ...props }: IconProps) {
  return (
    <svg {...baseProps(size)} {...props}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconSearch({ size = 20, ...props }: IconProps) {
  return (
    <svg {...baseProps(size)} {...props}>
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconMail({ size = 20, ...props }: IconProps) {
  return (
    <svg {...baseProps(size)} {...props}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconRefresh({ size = 20, ...props }: IconProps) {
  return (
    <svg {...baseProps(size)} {...props}>
      <polyline points="23 4 23 10 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="1 20 1 14 7 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconLightbulb({ size = 20, ...props }: IconProps) {
  return (
    <svg {...baseProps(size)} {...props}>
      <path d="M9 18h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 22h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconUser({ size = 20, ...props }: IconProps) {
  return (
    <svg {...baseProps(size)} {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function IconEye({ size = 20, ...props }: IconProps) {
  return (
    <svg {...baseProps(size)} {...props}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}