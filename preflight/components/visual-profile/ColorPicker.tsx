"use client";

import React, { useState } from "react";
import { CURATED_COLOR_PALETTES } from "@/lib/visual-profile/constants";
import styles from "./ColorPicker.module.css";

interface ColorPickerProps {
  primaryColor: string;
  secondaryColor: string;
  onPrimaryChange: (color: string) => void;
  onSecondaryChange: (color: string) => void;
  isLoading?: boolean;
}

export function ColorPicker({
  primaryColor,
  secondaryColor,
  onPrimaryChange,
  onSecondaryChange,
  isLoading = false,
}: ColorPickerProps) {
  const [showCustomPrimary, setShowCustomPrimary] = useState(false);
  const [showCustomSecondary, setShowCustomSecondary] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Colori del Brand</h3>
        <p className={styles.subtitle}>
          Seleziona o personalizza i colori primario e secondario del tuo brand
        </p>
      </div>

      {/* Curated Palettes */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Palette Curate</h4>
        <div className={styles.paletteGrid}>
          {CURATED_COLOR_PALETTES.map((palette) => (
            <button
              key={palette.name}
              onClick={() => {
                onPrimaryChange(palette.primary);
                onSecondaryChange(palette.secondary);
              }}
              disabled={isLoading}
              className={styles.paletteButton}
              title={palette.name}
            >
              <div className={styles.paletteName}>{palette.name}</div>
              <div className={styles.paletteColors}>
                <div
                  className={styles.colorBox}
                  style={{ backgroundColor: palette.primary }}
                />
                <div
                  className={styles.colorBox}
                  style={{ backgroundColor: palette.secondary }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Color Selection */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Colori Personalizzati</h4>
        <div className={styles.colorGrid}>
          {/* Primary Color */}
          <div className={styles.colorInputGroup}>
            <label className={styles.label}>Colore Primario</label>
            <div className={styles.inputWrapper}>
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => onPrimaryChange(e.target.value)}
                disabled={isLoading}
                className={styles.colorInput}
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => {
                  if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                    onPrimaryChange(e.target.value);
                  }
                }}
                disabled={isLoading}
                className={styles.textInput}
                placeholder="#000000"
              />
            </div>
            <p className={styles.description}>Colore principale per CTA e elementi in evidenza</p>
          </div>

          {/* Secondary Color */}
          <div className={styles.colorInputGroup}>
            <label className={styles.label}>Colore Secondario</label>
            <div className={styles.inputWrapper}>
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => onSecondaryChange(e.target.value)}
                disabled={isLoading}
                className={styles.colorInput}
              />
              <input
                type="text"
                value={secondaryColor}
                onChange={(e) => {
                  if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                    onSecondaryChange(e.target.value);
                  }
                }}
                disabled={isLoading}
                className={styles.textInput}
                placeholder="#000000"
              />
            </div>
            <p className={styles.description}>Colore accento per elementi secondari</p>
          </div>
        </div>
      </div>

      {/* Color Preview */}
      <div className={styles.preview}>
        <h4 className={styles.previewTitle}>Anteprima</h4>
        <div className={styles.previewContainer}>
          <div className={styles.previewBox}>
            <div className={styles.previewLabel}>Primario</div>
            <div
              className={styles.previewColor}
              style={{ backgroundColor: primaryColor }}
            />
            <div className={styles.previewValue}>{primaryColor}</div>
          </div>
          <div className={styles.previewBox}>
            <div className={styles.previewLabel}>Secondario</div>
            <div
              className={styles.previewColor}
              style={{ backgroundColor: secondaryColor }}
            />
            <div className={styles.previewValue}>{secondaryColor}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
