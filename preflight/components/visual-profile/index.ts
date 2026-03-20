// Export components
export { VisualProfileSetup } from "./VisualProfileSetup";
export { PresetSelector } from "./PresetSelector";
export { ColorPicker } from "./ColorPicker";
export { TypographyPreview } from "./TypographyPreview";
export { PhotoStrategySelector } from "./PhotoStrategySelector";

// Export hooks
export { useVisualProfile } from "./useVisualProfile";

// Export types and constants
export type { VisualProfile } from "@/lib/visual-profile/utils";
export {
  STYLE_PRESETS,
  VISUAL_TONES,
  TYPOGRAPHY_PRESETS,
  CONTENT_STYLE_PERSONALITIES,
  PHOTO_STRATEGIES,
  BACKGROUND_STYLES,
  CURATED_COLOR_PALETTES,
  DEFAULT_VISUAL_PROFILE,
} from "@/lib/visual-profile/constants";
