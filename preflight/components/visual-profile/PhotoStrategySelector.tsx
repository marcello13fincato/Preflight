"use client";

import React from "react";
import { PHOTO_STRATEGIES, PhotoStrategyId } from "@/lib/visual-profile/constants";
import styles from "./PhotoStrategySelector.module.css";

interface PhotoStrategySelectorProps {
  selectedStrategy: PhotoStrategyId;
  onSelect: (strategyId: PhotoStrategyId) => void;
  isLoading?: boolean;
}

export function PhotoStrategySelector({
  selectedStrategy,
  onSelect,
  isLoading = false,
}: PhotoStrategySelectorProps) {
  const strategyIcons = {
    real_photos: "📸",
    graphics: "🎨",
    hybrid: "🎭",
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Strategia Foto e Visual</h3>
        <p className={styles.subtitle}>
          Come dovrebbero i tuoi contenuti usare fotografie e grafiche?
        </p>
      </div>

      <div className={styles.grid}>
        {Object.entries(PHOTO_STRATEGIES).map(([key, strategy]) => (
          <button
            key={key}
            onClick={() => onSelect(key as PhotoStrategyId)}
            disabled={isLoading}
            className={`${styles.card} ${
              selectedStrategy === key ? styles.selected : ""
            }`}
          >
            {/* Icon */}
            <div className={styles.iconWrapper}>
              <span className={styles.icon}>
                {strategyIcons[key as PhotoStrategyId]}
              </span>
            </div>

            {/* Content */}
            <div className={styles.content}>
              <h4 className={styles.title}>{strategy.name}</h4>
              <p className={styles.description}>{strategy.description}</p>
              
              <div className={styles.guidance}>
                <p className={styles.guidanceLabel}>Guida AI:</p>
                <p className={styles.guidanceText}>{strategy.aiGuidance}</p>
              </div>

              <div className={styles.bestFor}>
                <p className={styles.bestForLabel}>Ideale per:</p>
                <ul className={styles.bestForList}>
                  {strategy.forWho.map((who, idx) => (
                    <li key={idx}>{who}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Checkmark */}
            {selectedStrategy === key && (
              <div className={styles.checkmark}>✓</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
