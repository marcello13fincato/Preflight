import * as React from "react";

interface GradientBandProps {
  children: React.ReactNode;
  className?: string;
}

export default function GradientBand({ children, className = "" }: GradientBandProps) {
  return (
    <div className={`w-full py-16 bg-gradient-to-r from-primary to-primary-hover text-white ${className}`}>
      {children}
    </div>
  );
}
