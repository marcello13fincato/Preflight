"use client";

import React from "react";
import { TYPOGRAPHY_PRESETS, TypographyPresetId } from "@/lib/visual-profile/constants";
import styles from "./TypographyPreview.module.css";

interface TypographyPreviewProps {
  selectedPreset: TypographyPresetId;
  onSelect: (presetId: TypographyPresetId) => void;
  isLoading?: boolean;
}

export function TypographyPreview({
  selectedPreset,
  onSelect,
  isLoading = false,
}: TypographyPreviewProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Typography</h3>
        <p className={styles.subtitle}>
          Choose a professional typography preset for your visual identity
        </p>
      </div>

      <div className={styles.grid}>
        {Object.entries(TYPOGRAPHY_PRESETS).map(([key, preset]) => (
          <button
            key={key}
            onClick={() => onSelect(key as TypographyPresetId)}
            disabled={isLoading}
            className={`${styles.card} ${
              selectedPreset === key ? styles.selected : ""
            }`}
          >
            <div className={styles.preview} style={{ fontFamily: preset.fontFamily }}>
              <div className={styles.heading} style={{ fontWeight: preset.headingWeight }}>
                Heading
              </div>
              <div className={styles.body} style={{ fontWeight: preset.bodyWeight }}>
                Body text goes here with intention and clarity.
              </div>
            </div>

            <div className={styles.info}>
              <h4 className={styles.name}>{preset.name}</h4>
              <p className={styles.description}>{preset.description}</p>
              <div className={styles.characteristics}>
                {preset.characteristics.map((char, idx) => (
                  <span key={idx} className={styles.badge}>
                    {char}
                  </span>
                ))}
              </div>
            </div>

            {selectedPreset === key && (
              <div className={styles.checkmark}>✓</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
