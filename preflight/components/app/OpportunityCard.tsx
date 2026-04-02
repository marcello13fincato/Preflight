"use client";

import React from "react";

export interface OpportunityCardProps {
  icon: string;
  title: string;
  reason: string;
  action: string;
  variant: "urgent" | "warm" | "unlock" | "call";
}

export default function OpportunityCard({ icon, title, reason, action, variant }: OpportunityCardProps) {
  return (
    <div className={`opp-card-v7 opp-card-v7-${variant}`}>
      <div className="opp-card-v7-header">
        <span className="opp-card-v7-icon">{icon}</span>
        <span className={`opp-card-v7-badge opp-card-v7-badge-${variant}`}>
          {variant === "urgent" ? "Urgente" : variant === "warm" ? "Caldo" : variant === "unlock" ? "Da sbloccare" : "Alta probabilità"}
        </span>
      </div>
      <h4 className="opp-card-v7-title">{title}</h4>
      <p className="opp-card-v7-reason">{reason}</p>
      <div className="opp-card-v7-action">
        <span className="opp-card-v7-action-label">Azione →</span>
        <p className="opp-card-v7-action-text">{action}</p>
      </div>
    </div>
  );
}
