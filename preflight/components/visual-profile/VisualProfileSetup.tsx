"use client";

import React, { useState } from "react";
import { useVisualProfile } from "./useVisualProfile";
import { PresetSelector } from "./PresetSelector";
import { ColorPicker } from "./ColorPicker";
import { TypographyPreview } from "./TypographyPreview";
import { PhotoStrategySelector } from "./PhotoStrategySelector";
import { VisualProfile } from "@/lib/visual-profile/utils";
import { StylePresetId } from "@/lib/visual-profile/constants";
import styles from "./VisualProfileSetup.module.css";

interface VisualProfileSetupProps {
  onComplete?: () => void;
  compact?: boolean; // Compact mode for settings page
}

export function VisualProfileSetup({
  onComplete,
  compact = false,
}: VisualProfileSetupProps) {
  const { profile, loading, error, isSaving, updateProfile } =
    useVisualProfile();
  const [currentStep, setCurrentStep] = useState(0);
  const [localProfile, setLocalProfile] = useState<VisualProfile | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Initialize local profile when fetched
  React.useEffect(() => {
    if (profile && !localProfile) {
      setLocalProfile(profile);
    }
  }, [profile, localProfile]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading visual profile...</p>
      </div>
    );
  }

  if (!localProfile) {
    return (
      <div className={styles.error}>
        <p>Failed to load visual profile</p>
        {error && <p className={styles.errorDetail}>{error}</p>}
      </div>
    );
  }

  const steps = [
    {
      id: "preset",
      title: "Choose Your Style",
      description: "Select a visual style preset that matches your brand",
    },
    {
      id: "colors",
      title: "Brand Colors",
      description: "Customize your primary and secondary colors",
    },
    {
      id: "typography",
      title: "Typography",
      description: "Select a professional font pairing",
    },
    {
      id: "photos",
      title: "Visual Strategy",
      description: "Choose your photo and graphics approach",
    },
  ];

  const handlePresetChange = (presetId: StylePresetId) => {
    setLocalProfile((prev) => (prev ? { ...prev, stylePreset: presetId } : null));
  };

  const handleColorChange = (
    colorType: "primary" | "secondary",
    color: string
  ) => {
    if (colorType === "primary") {
      setLocalProfile((prev) =>
        prev ? { ...prev, primaryColor: color } : null
      );
    } else {
      setLocalProfile((prev) =>
        prev ? { ...prev, secondaryColor: color } : null
      );
    }
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save and complete
      await handleSave();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    try {
      setSaveError(null);
      if (localProfile) {
        await updateProfile({
          ...localProfile,
          setupComplete: true,
        });
        onComplete?.();
      }
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Failed to save profile"
      );
    }
  };

  if (compact) {
    // Compact view for settings page - show all sections at once
    return (
      <div className={styles.compactContainer}>
        <PresetSelector
          selectedPreset={localProfile.stylePreset as StylePresetId}
          onSelect={handlePresetChange}
          isLoading={isSaving}
        />

        <ColorPicker
          primaryColor={localProfile.primaryColor}
          secondaryColor={localProfile.secondaryColor}
          onPrimaryChange={(color) => handleColorChange("primary", color)}
          onSecondaryChange={(color) => handleColorChange("secondary", color)}
          isLoading={isSaving}
        />

        <TypographyPreview
          selectedPreset={
            localProfile.typographyPreset as any
          }
          onSelect={(preset) =>
            setLocalProfile((prev) =>
              prev ? { ...prev, typographyPreset: preset } : null
            )
          }
          isLoading={isSaving}
        />

        <PhotoStrategySelector
          selectedStrategy={
            localProfile.photoStrategy as any
          }
          onSelect={(strategy) =>
            setLocalProfile((prev) =>
              prev ? { ...prev, photoStrategy: strategy } : null
            )
          }
          isLoading={isSaving}
        />

        {saveError && <div className={styles.error}>{saveError}</div>}

        <button
          onClick={handleSave}
          disabled={isSaving}
          className={styles.saveButton}
        >
          {isSaving ? "Saving..." : "Save Visual Profile"}
        </button>
      </div>
    );
  }

  // Step-by-step guided mode
  const step = steps[currentStep];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.stepIndicator}>
          <div className={styles.stepNumber}>{currentStep + 1}</div>
          <div className={styles.stepDivider} />
          <div className={styles.stepTotal}>{steps.length}</div>
        </div>
        <h1 className={styles.title}>{step.title}</h1>
        <p className={styles.subtitle}>{step.description}</p>
      </div>

      {/* Progress bar */}
      <div className={styles.progressBar}>
        <div
          className={styles.progress}
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Content */}
      <div className={styles.content}>
        {currentStep === 0 && (
          <PresetSelector
            selectedPreset={localProfile.stylePreset as StylePresetId}
            onSelect={handlePresetChange}
            isLoading={isSaving}
          />
        )}

        {currentStep === 1 && (
          <ColorPicker
            primaryColor={localProfile.primaryColor}
            secondaryColor={localProfile.secondaryColor}
            onPrimaryChange={(color) => handleColorChange("primary", color)}
            onSecondaryChange={(color) => handleColorChange("secondary", color)}
            isLoading={isSaving}
          />
        )}

        {currentStep === 2 && (
          <TypographyPreview
            selectedPreset={
              localProfile.typographyPreset as any
            }
            onSelect={(preset) =>
              setLocalProfile((prev) =>
                prev ? { ...prev, typographyPreset: preset } : null
              )
            }
            isLoading={isSaving}
          />
        )}

        {currentStep === 3 && (
          <PhotoStrategySelector
            selectedStrategy={
              localProfile.photoStrategy as any
            }
            onSelect={(strategy) =>
              setLocalProfile((prev) =>
                prev ? { ...prev, photoStrategy: strategy } : null
              )
            }
            isLoading={isSaving}
          />
        )}
      </div>

      {/* Error message */}
      {saveError && (
        <div className={styles.errorMessage}>{saveError}</div>
      )}

      {/* Actions */}
      <div className={styles.actions}>
        <button
          onClick={handleBack}
          disabled={currentStep === 0 || isSaving}
          className={styles.backButton}
        >
          Back
        </button>

        <button
          onClick={handleNext}
          disabled={isSaving}
          className={styles.nextButton}
        >
          {isSaving ? "Saving..." : currentStep === steps.length - 1 ? "Complete Setup" : "Next"}
        </button>
      </div>
    </div>
  );
}
