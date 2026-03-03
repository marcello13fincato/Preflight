import React from "react";

export default function IconBadge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-soft text-primary ${className}`}>
      {children}
    </span>
  );
}
