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