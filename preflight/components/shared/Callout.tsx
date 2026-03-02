import * as React from "react";

interface CalloutProps {
  children: React.ReactNode;
  className?: string;
}

export default function Callout({ children, className = "" }: CalloutProps) {
  return (
    <div className={`border-l-4 border-primary bg-background-alt p-4 ${className}`}>
      {children}
    </div>
  );
}
