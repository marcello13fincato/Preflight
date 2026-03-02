import * as React from "react";

interface Step {
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface StepperProps {
  steps: Step[];
  className?: string;
}

export default function Stepper({ steps, className = "" }: StepperProps) {
  return (
    <div className={`flex flex-col md:flex-row md:justify-between gap-6 ${className}`}> 
      {steps.map((step, idx) => {
        const Icon = step.icon;
        return (
          <div key={idx} className="flex-1 flex items-start gap-4">
            <Icon className="w-8 h-8 text-primary flex-shrink-0" />
            <div>
              <div className="font-semibold">{step.title}</div>
              <div className="text-text-secondary text-sm">{step.description}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
