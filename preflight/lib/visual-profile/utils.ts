/**
 * Visual Profile Utilities
 * 
 * Helper functions for working with visual profiles.
 */

import {
  STYLE_PRESETS,
  VISUAL_TONES,
  TYPOGRAPHY_PRESETS,
  CONTENT_STYLE_PERSONALITIES,
  PHOTO_STRATEGIES,
  BACKGROUND_STYLES,
  CURATED_COLOR_PALETTES,
  DEFAULT_VISUAL_PROFILE,
  StylePresetId,
  VisualToneId,
  TypographyPresetId,
  ContentStylePersonalityId,
  PhotoStrategyId,
  BackgroundStyleId,
} from "./constants";

export interface VisualProfile {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: BackgroundStyleId;
  visualTone: VisualToneId;
  typographyPreset: TypographyPresetId;
  contentStylePersonality: ContentStylePersonalityId;
  photoStrategy: PhotoStrategyId;
  stylePreset: StylePresetId;
  setupComplete: boolean;
  colorSuggestions?: Array<{
    primary: string;
    secondary: string;
    backgroundColor: BackgroundStyleId;
    reasoning?: string;
  }>;
  designNotes?: string;
}

/**
 * Get all available preset options
 */
export function getAllPresets() {
  return {
    stylePresets: Object.values(STYLE_PRESETS),
    visualTones: Object.values(VISUAL_TONES),
    typographyPresets: Object.values(TYPOGRAPHY_PRESETS),
    contentStylePersonalities: Object.values(CONTENT_STYLE_PERSONALITIES),
    photoStrategies: Object.values(PHOTO_STRATEGIES),
    backgroundStyles: Object.values(BACKGROUND_STYLES),
    curatedColorPalettes: CURATED_COLOR_PALETTES,
  };
}

/**
 * Get a specific style preset
 */
export function getStylePreset(id: StylePresetId) {
  return STYLE_PRESETS[id];
}

/**
 * Get a specific visual tone
 */
export function getVisualTone(id: VisualToneId) {
  return VISUAL_TONES[id];
}

/**
 * Get a specific typography preset
 */
export function getTypographyPreset(id: TypographyPresetId) {
  return TYPOGRAPHY_PRESETS[id];
}

/**
 * Get a specific content style personality
 */
export function getContentStylePersonality(id: ContentStylePersonalityId) {
  return CONTENT_STYLE_PERSONALITIES[id];
}

/**
 * Get a specific photo strategy
 */
export function getPhotoStrategy(id: PhotoStrategyId) {
  return PHOTO_STRATEGIES[id];
}

/**
 * Get a specific background style
 */
export function getBackgroundStyle(id: BackgroundStyleId) {
  return BACKGROUND_STYLES[id];
}

/**
 * Get curated color palettes that match a preset
 */
export function getColorPalettesForPreset(presetId: StylePresetId) {
  return CURATED_COLOR_PALETTES.filter((p) => p.preset === presetId);
}

/**
 * Generate AI-suggested color combinations based on mood/requirements
 * (Simplified version - can be enhanced with real AI later)
 */
export function generateColorSuggestions(
  tone: VisualToneId,
  personality: ContentStylePersonalityId
) {
  // Return the most relevant palettes from our curated set
  const relevant = CURATED_COLOR_PALETTES.slice(0, 3).map((p) => ({
    primary: p.primary,
    secondary: p.secondary,
    backgroundColor: p.background,
    reasoning: `Suggested based on "${tone}" tone and "${personality}" personality`,
  }));
  return relevant;
}

/**
 * Apply a visual profile to store in database
 */
export function createVisualProfile(
  overrides?: Partial<VisualProfile>
): VisualProfile {
  return {
    ...DEFAULT_VISUAL_PROFILE,
    ...overrides,
  };
}

/**
 * Validate a visual profile
 */
export function isValidVisualProfile(profile: unknown): profile is VisualProfile {
  if (typeof profile !== "object" || !profile) return false;
  const p = profile as Record<string, unknown>;

  return (
    typeof p.primaryColor === "string" &&
    typeof p.secondaryColor === "string" &&
    typeof p.backgroundColor === "string" &&
    typeof p.visualTone === "string" &&
    typeof p.typographyPreset === "string" &&
    typeof p.contentStylePersonality === "string" &&
    typeof p.photoStrategy === "string" &&
    typeof p.stylePreset === "string" &&
    typeof p.setupComplete === "boolean"
  );
}
