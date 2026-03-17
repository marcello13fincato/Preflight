/**
 * Visual Profile AI Context Builder
 * 
 * Formats visual profile data for AI prompts to influence content generation
 */

import { VisualProfile } from "./utils";
import {
  STYLE_PRESETS,
  VISUAL_TONES,
  PHOTO_STRATEGIES,
  TYPOGRAPHY_PRESETS,
  CONTENT_STYLE_PERSONALITIES,
  StylePresetId,
  VisualToneId,
  TypographyPresetId,
  ContentStylePersonalityId,
  PhotoStrategyId,
} from "./constants";

/**
 * Format visual profile for AI image generation prompt
 */
export function formatVisualProfileForImagePrompt(profile: VisualProfile | null): string {
  if (!profile) return "";

  const tone = VISUAL_TONES[profile.visualTone as VisualToneId];
  const preset = STYLE_PRESETS[profile.stylePreset as StylePresetId];
  const photoStrategy = PHOTO_STRATEGIES[profile.photoStrategy as PhotoStrategyId];

  return `

VISUAL PROFILE GUIDELINES:
- Primary Brand Color: ${profile.primaryColor}
- Secondary Color: ${profile.secondaryColor}
- Visual Tone: ${tone?.name || profile.visualTone} (${tone?.description || ""})
- Style Preset: ${preset?.name || profile.stylePreset}
- Background Style: ${profile.backgroundColor}
- Photo Strategy: ${photoStrategy?.name || profile.photoStrategy}
${photoStrategy?.aiGuidance ? `  Direction: ${photoStrategy.aiGuidance}` : ""}
`;
}

/**
 * Format visual profile for AI content generation prompt
 * 
 * This helps the AI understand the user's visual preferences
 * and content personality when generating posts
 */
export function formatVisualProfileForContentPrompt(profile: VisualProfile | null): string {
  if (!profile) return "";

  const personality = CONTENT_STYLE_PERSONALITIES[profile.contentStylePersonality as ContentStylePersonalityId];
  const typography = TYPOGRAPHY_PRESETS[profile.typographyPreset as TypographyPresetId];
  const preset = STYLE_PRESETS[profile.stylePreset as StylePresetId];

  return `

VISUAL & CONTENT PROFILE:
- Brand Personality: ${personality?.name || profile.contentStylePersonality}
${personality?.aiGuidance ? `  Strategy: ${personality.aiGuidance}` : ""}
- Visual Style: ${preset?.name || profile.stylePreset}
- Typography Tone: ${typography?.name || profile.typographyPreset}
- Preferred Tone: ${profile.visualTone}
`;
}

/**
 * Generate AI hints for carousel generation based on visual profile
 */
export function generateCarouselStyleHints(profile: VisualProfile | null): string {
  if (!profile) return "";

  const photoStrategy = PHOTO_STRATEGIES[profile.photoStrategy as PhotoStrategyId];

  return `
CAROUSEL VISUAL GUIDELINES:
- Color scheme: Use primary (${profile.primaryColor}) for CTAs and key elements, secondary (${profile.secondaryColor}) for accents
- Background: ${profile.backgroundColor} style
- Photo approach: ${photoStrategy?.name || profile.photoStrategy}
- Visual consistency: Maintain ${profile.visualTone} visual tone across slides
- Typography: ${profile.typographyPreset} preset for slide text
`;
}

/**
 * Get color CSS variables from visual profile for component styling
 */
export function getVisualProfileCSSVariables(profile: VisualProfile | null) {
  if (!profile) return {};

  return {
    "--primary-color": profile.primaryColor,
    "--secondary-color": profile.secondaryColor,
    "--bg-style": profile.backgroundColor,
    "--visual-tone": profile.visualTone,
  };
}
