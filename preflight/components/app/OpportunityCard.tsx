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
    <div className={`opp-card opp-card-${variant}`}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span className="opp-card-icon">{icon}</span>
        <span className={`conv-status conv-status-${variant === "urgent" ? "hot" : variant === "call" ? "warm" : variant === "warm" ? "warm" : "cold"}`}>
          {variant === "urgent" ? "Urgente" : variant === "warm" ? "Caldo" : variant === "unlock" ? "Da sbloccare" : "Alta probabilità"}
        </span>
      </div>
      <h4 className="opp-card-title">{title}</h4>
      <p className="opp-card-reason">{reason}</p>
      <p className="opp-card-action">{action}</p>
    </div>
  );
}
