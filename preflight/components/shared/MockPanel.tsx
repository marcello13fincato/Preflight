import * as React from "react";

interface MockPanelProps {
  title: string;
  children?: React.ReactNode;
  className?: string;
}

export default function MockPanel({ title, children, className = "" }: MockPanelProps) {
  return (
    <div className={`border rounded-lg bg-background-alt p-6 shadow-sm ${className}`}>
      <h4 className="font-semibold mb-4">{title}</h4>
      {children}
    </div>
  );
}
