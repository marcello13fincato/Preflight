/**
 * Visual Profile Constants
 * 
 * Curated, limited sets of professional visual style options.
 * Designed to keep the system simple and guided, not overwhelming.
 */

// ────────────────────────────────────────────────────────────
// Style Presets
// ────────────────────────────────────────────────────────────

export const STYLE_PRESETS = {
  minimal_corporate: {
    id: "minimal_corporate",
    name: "Minimal Corporate",
    description: "Clean, professional, trustworthy. Perfect for executives and consultants.",
    icon: "briefcase",
    suggestedColors: {
      primaryColor: "#1F2937",
      secondaryColor: "#6366F1",
      backgroundColor: "clean",
    },
    visualTone: "professional",
    typographyPreset: "classic",
    contentStylePersonality: "corporate",
    photoStrategy: "hybrid",
  },
  bold_founder: {
    id: "bold_founder",
    name: "Bold Founder",
    description: "Energetic, innovative, forward-thinking. For entrepreneurs and visionaries.",
    icon: "rocket",
    suggestedColors: {
      primaryColor: "#DC2626",
      secondaryColor: "#F59E0B",
      backgroundColor: "gradient",
    },
    visualTone: "energetic",
    typographyPreset: "modern",
    contentStylePersonality: "founder",
    photoStrategy: "real_photos",
  },
  consulting_premium: {
    id: "consulting_premium",
    name: "Consulting Premium",
    description: "Sophisticated, strategic, results-focused. For consultants and advisors.",
    icon: "chart-bar",
    suggestedColors: {
      primaryColor: "#0F766E",
      secondaryColor: "#06B6D4",
      backgroundColor: "clean",
    },
    visualTone: "professional",
    typographyPreset: "editorial",
    contentStylePersonality: "consultant",
    photoStrategy: "hybrid",
  },
  educational_coach: {
    id: "educational_coach",
    name: "Educational Coach",
    description: "Approachable, inspiring, growth-oriented. For coaches and educators.",
    icon: "lightbulb",
    suggestedColors: {
      primaryColor: "#059669",
      secondaryColor: "#8B5CF6",
      backgroundColor: "clean",
    },
    visualTone: "subtle",
    typographyPreset: "modern",
    contentStylePersonality: "educator",
    photoStrategy: "real_photos",
  },
  tech_modern: {
    id: "tech_modern",
    name: "Tech Modern",
    description: "Cutting-edge, innovative, technical. For tech founders and developers.",
    icon: "cpu",
    suggestedColors: {
      primaryColor: "#0EA5E9",
      secondaryColor: "#A855F7",
      backgroundColor: "gradient",
    },
    visualTone: "energetic",
    typographyPreset: "modern",
    contentStylePersonality: "technical",
    photoStrategy: "graphics",
  },
};

export type StylePresetId = keyof typeof STYLE_PRESETS;

// ────────────────────────────────────────────────────────────
// Visual Tones
// ────────────────────────────────────────────────────────────

export const VISUAL_TONES = {
  professional: {
    id: "professional",
    name: "Professional",
    description: "Trustworthy, established, reliable",
    characteristics: ["Clean", "Polished", "Corporate"],
  },
  bold: {
    id: "bold",
    name: "Bold",
    description: "Stand out, confident, impactful",
    characteristics: ["Strong Colors", "Clear Message", "Direct"],
  },
  subtle: {
    id: "subtle",
    name: "Subtle",
    description: "Refined, elegant, understated",
    characteristics: ["Minimal", "Sophisticated", "Timeless"],
  },
  energetic: {
    id: "energetic",
    name: "Energetic",
    description: "Dynamic, innovative, forward-thinking",
    characteristics: ["Vibrant", "Modern", "Fast-paced"],
  },
};

export type VisualToneId = keyof typeof VISUAL_TONES;

// ────────────────────────────────────────────────────────────
// Typography Presets
// ────────────────────────────────────────────────────────────

export const TYPOGRAPHY_PRESETS = {
  modern: {
    id: "modern",
    name: "Modern",
    description: "Contemporary, clean sans-serif stack",
    fontFamily: "'Inter', 'Roboto', sans-serif",
    headingWeight: 700,
    bodyWeight: 400,
    characteristics: ["Contemporary", "Readable", "Professional"],
  },
  classic: {
    id: "classic",
    name: "Classic",
    description: "Timeless serif and sans-serif combination",
    fontFamily: "'Crimson Text', 'Georgia', serif",
    headingWeight: 600,
    bodyWeight: 400,
    characteristics: ["Elegant", "Established", "Refined"],
  },
  minimal: {
    id: "minimal",
    name: "Minimal",
    description: "Stripped-down, ultra-clean",
    fontFamily: "'Helvetica Neue', 'Arial', sans-serif",
    headingWeight: 600,
    bodyWeight: 400,
    characteristics: ["Minimal", "Direct", "Modern"],
  },
  editorial: {
    id: "editorial",
    name: "Editorial",
    description: "Magazine-style with more personality",
    fontFamily: "'Playfair Display', 'Garamond', serif",
    headingWeight: 700,
    bodyWeight: 400,
    characteristics: ["Distinctive", "Stylish", "Professional"],
  },
};

export type TypographyPresetId = keyof typeof TYPOGRAPHY_PRESETS;

// ────────────────────────────────────────────────────────────
// Content Style Personalities
// ────────────────────────────────────────────────────────────

export const CONTENT_STYLE_PERSONALITIES = {
  founder: {
    id: "founder",
    name: "Founder",
    description: "Entrepreneurial, visionary, growth-focused",
    aiGuidance: "Emphasize innovation, disruption, and bold thinking",
    contentTendencies: ["Forward-looking", "Risk-taking", "Passionate"],
  },
  corporate: {
    id: "corporate",
    name: "Corporate",
    description: "Professional, structured, results-driven",
    aiGuidance: "Focus on strategy, execution, and business value",
    contentTendencies: ["Data-driven", "Professional", "Measured"],
  },
  consultant: {
    id: "consultant",
    name: "Consultant",
    description: "Advisory, strategic, insight-driven",
    aiGuidance: "Highlight expertise, case studies, and ROI",
    contentTendencies: ["Strategic", "Analytical", "Advisory"],
  },
  educator: {
    id: "educator",
    name: "Educator",
    description: "Teaching-focused, empowering, growth-minded",
    aiGuidance: "Prioritize learning moments, frameworks, and development",
    contentTendencies: ["Educational", "Empowering", "Supportive"],
  },
  technical: {
    id: "technical",
    name: "Technical",
    description: "Innovation-focused, detailed, solution-oriented",
    aiGuidance: "Emphasize technology, solutions, and technical depth",
    contentTendencies: ["Technical", "Detailed", "Innovative"],
  },
};

export type ContentStylePersonalityId = keyof typeof CONTENT_STYLE_PERSONALITIES;

// ────────────────────────────────────────────────────────────
// Photo Strategies
// ────────────────────────────────────────────────────────────

export const PHOTO_STRATEGIES = {
  real_photos: {
    id: "real_photos",
    name: "Real Photos",
    description: "Authentic, personal, human-focused content with real photography",
    aiGuidance: "Source high-quality professional headshots and candid photos",
    forWho: ["Personal brands", "Thought leaders", "Coaches"],
  },
  graphics: {
    id: "graphics",
    name: "Mostly Graphics",
    description: "Design-focused, conceptual, visual metaphors and illustrations",
    aiGuidance: "Generate or source custom graphics, icons, and illustrations",
    forWho: ["B2B companies", "Tech founders", "Design-conscious brands"],
  },
  hybrid: {
    id: "hybrid",
    name: "Hybrid Approach",
    description: "Mix of real photos, graphics, icons, and visual elements",
    aiGuidance: "Balance authentic photos with strategic graphics and visual elements",
    forWho: ["Most professionals", "Consultants", "Mixed-content creators"],
  },
};

export type PhotoStrategyId = keyof typeof PHOTO_STRATEGIES;

// ────────────────────────────────────────────────────────────
// Background Styles
// ────────────────────────────────────────────────────────────

export const BACKGROUND_STYLES = {
  clean: {
    id: "clean",
    name: "Clean",
    description: "Solid background, minimal visual noise",
    css: "bg-white dark:bg-gray-950",
  },
  gradient: {
    id: "gradient",
    name: "Gradient",
    description: "Subtle gradient background for visual interest",
    css: "bg-gradient-to-br from-white to-gray-50 dark:from-gray-950 dark:to-gray-900",
  },
  minimalist: {
    id: "minimalist",
    name: "Minimalist",
    description: "Ultra-simple, single color with texture",
    css: "bg-gray-50 dark:bg-gray-900",
  },
};

export type BackgroundStyleId = keyof typeof BACKGROUND_STYLES;

// ────────────────────────────────────────────────────────────
// Curated Color Palettes
// ────────────────────────────────────────────────────────────

export const CURATED_COLOR_PALETTES = [
  {
    name: "Innovation Blue",
    primary: "#0EA5E9",
    secondary: "#06B6D4",
    background: "clean",
    preset: "tech_modern",
  },
  {
    name: "Legacy Gold",
    primary: "#F59E0B",
    secondary: "#D97706",
    background: "clean",
    preset: "consulting_premium",
  },
  {
    name: "Growth Green",
    primary: "#10B981",
    secondary: "#059669",
    background: "clean",
    preset: "educational_coach",
  },
  {
    name: "Power Red",
    primary: "#DC2626",
    secondary: "#991B1B",
    background: "gradient",
    preset: "bold_founder",
  },
  {
    name: "Executive Slate",
    primary: "#1F2937",
    secondary: "#6366F1",
    background: "clean",
    preset: "minimal_corporate",
  },
  {
    name: "Creative Purple",
    primary: "#A855F7",
    secondary: "#9333EA",
    background: "gradient",
    preset: "tech_modern",
  },
  {
    name: "Trust Teal",
    primary: "#0D9488",
    secondary: "#14B8A6",
    background: "clean",
    preset: "consulting_premium",
  },
  {
    name: "Founder Orange",
    primary: "#EA580C",
    secondary: "#FB923C",
    background: "gradient",
    preset: "bold_founder",
  },
];

// ────────────────────────────────────────────────────────────
// Default Visual Profile
// ────────────────────────────────────────────────────────────

export const DEFAULT_VISUAL_PROFILE = {
  primaryColor: "#3B82F6",
  secondaryColor: "#10B981",
  backgroundColor: "clean" as BackgroundStyleId,
  visualTone: "professional" as VisualToneId,
  typographyPreset: "modern" as TypographyPresetId,
  contentStylePersonality: "founder" as ContentStylePersonalityId,
  photoStrategy: "hybrid" as PhotoStrategyId,
  stylePreset: "minimal_corporate" as StylePresetId,
  setupComplete: false,
};
