"use client";

import React from "react";
import { STYLE_PRESETS, StylePresetId } from "@/lib/visual-profile/constants";
import styles from "./PresetSelector.module.css";

interface PresetSelectorProps {
  selectedPreset: StylePresetId;
  onSelect: (presetId: StylePresetId) => void;
  isLoading?: boolean;
}

export function PresetSelector({
  selectedPreset,
  onSelect,
  isLoading = false,
}: PresetSelectorProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Visual Style Presets</h3>
        <p className={styles.subtitle}>
          Choose a curated visual style that matches your brand
        </p>
      </div>

      <div className={styles.grid}>
        {Object.entries(STYLE_PRESETS).map(([key, preset]) => (
          <button
            key={key}
            onClick={() => onSelect(key as StylePresetId)}
            disabled={isLoading}
            className={`${styles.card} ${
              selectedPreset === key ? styles.selected : ""
            }`}
          >
            <div className={styles.cardContent}>
              <div className={styles.iconWrapper}>
                <span className={styles.icon}>
                  {preset.icon === "briefcase" && "💼"}
                  {preset.icon === "rocket" && "🚀"}
                  {preset.icon === "chart-bar" && "📊"}
                  {preset.icon === "lightbulb" && "💡"}
                  {preset.icon === "cpu" && "⚙️"}
                </span>
              </div>
              <div className={styles.info}>
                <h4 className={styles.cardTitle}>{preset.name}</h4>
                <p className={styles.cardDesc}>{preset.description}</p>
              </div>
            </div>

            {/* Color preview */}
            <div className={styles.colorPreview}>
              <div
                className={styles.colorSample}
                style={{
                  backgroundColor: preset.suggestedColors.primaryColor,
                }}
                title={`Primary: ${preset.suggestedColors.primaryColor}`}
              />
              <div
                className={styles.colorSample}
                style={{
                  backgroundColor: preset.suggestedColors.secondaryColor,
                }}
                title={`Secondary: ${preset.suggestedColors.secondaryColor}`}
              />
            </div>

            {/* Checkmark */}
            {selectedPreset === key && (
              <div className={styles.checkmark}>✓</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
