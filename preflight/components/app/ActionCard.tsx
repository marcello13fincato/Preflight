"use client";

import React from "react";

export interface ActionCardProps {
  priority: "alta" | "media" | "bassa";
  why: string;
  what: string;
}

export default function ActionCard({ priority, why, what }: ActionCardProps) {
  return (
    <div className={`act-card-v7 act-card-v7-${priority}`}>
      <span className={`act-card-v7-badge act-card-v7-badge-${priority}`}>
        {priority === "alta" ? "Alta" : priority === "media" ? "Media" : "Bassa"}
      </span>
      <div className="act-card-v7-body">
        <p className="act-card-v7-why"><strong>Perché ora:</strong> {why}</p>
        <p className="act-card-v7-what"><strong>Cosa fare:</strong> {what}</p>
      </div>
    </div>
  );
}
