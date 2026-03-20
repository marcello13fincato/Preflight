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
    name: "Corporate Minimalista",
    description: "Pulito, professionale, affidabile. Perfetto per dirigenti e consulenti.",
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
    name: "Founder Audace",
    description: "Energico, innovativo, visionario. Per imprenditori e startupper.",
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
    description: "Sofisticato, strategico, orientato ai risultati. Per consulenti e advisor.",
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
    name: "Coach Educativo",
    description: "Accessibile, ispirante, orientato alla crescita. Per coach e formatori.",
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
    name: "Tech Moderno",
    description: "All'avanguardia, innovativo, tecnico. Per founder tech e sviluppatori.",
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
    name: "Professionale",
    description: "Affidabile, consolidato, serio",
    characteristics: ["Pulito", "Curato", "Corporate"],
  },
  bold: {
    id: "bold",
    name: "Audace",
    description: "Distinguiti, sicuro, d'impatto",
    characteristics: ["Colori forti", "Messaggio chiaro", "Diretto"],
  },
  subtle: {
    id: "subtle",
    name: "Sottile",
    description: "Raffinato, elegante, discreto",
    characteristics: ["Minimale", "Sofisticato", "Senza tempo"],
  },
  energetic: {
    id: "energetic",
    name: "Energetico",
    description: "Dinamico, innovativo, proiettato al futuro",
    characteristics: ["Vivace", "Moderno", "Dinamico"],
  },
};

export type VisualToneId = keyof typeof VISUAL_TONES;

// ────────────────────────────────────────────────────────────
// Typography Presets
// ────────────────────────────────────────────────────────────

export const TYPOGRAPHY_PRESETS = {
  modern: {
    id: "modern",
    name: "Moderno",
    description: "Contemporaneo, sans-serif pulito",
    fontFamily: "'Inter', 'Roboto', sans-serif",
    headingWeight: 700,
    bodyWeight: 400,
    characteristics: ["Contemporaneo", "Leggibile", "Professionale"],
  },
  classic: {
    id: "classic",
    name: "Classico",
    description: "Combinazione serif e sans-serif senza tempo",
    fontFamily: "'Crimson Text', 'Georgia', serif",
    headingWeight: 600,
    bodyWeight: 400,
    characteristics: ["Elegante", "Consolidato", "Raffinato"],
  },
  minimal: {
    id: "minimal",
    name: "Minimale",
    description: "Essenziale, ultra-pulito",
    fontFamily: "'Helvetica Neue', 'Arial', sans-serif",
    headingWeight: 600,
    bodyWeight: 400,
    characteristics: ["Minimale", "Diretto", "Moderno"],
  },
  editorial: {
    id: "editorial",
    name: "Editoriale",
    description: "Stile magazine con più personalità",
    fontFamily: "'Playfair Display', 'Garamond', serif",
    headingWeight: 700,
    bodyWeight: 400,
    characteristics: ["Distintivo", "Elegante", "Professionale"],
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
    description: "Imprenditoriale, visionario, orientato alla crescita",
    aiGuidance: "Enfatizza innovazione, disruption e pensiero audace",
    contentTendencies: ["Proiettato al futuro", "Coraggioso", "Appassionato"],
  },
  corporate: {
    id: "corporate",
    name: "Corporate",
    description: "Professionale, strutturato, orientato ai risultati",
    aiGuidance: "Focus su strategia, esecuzione e valore di business",
    contentTendencies: ["Data-driven", "Professionale", "Misurato"],
  },
  consultant: {
    id: "consultant",
    name: "Consulente",
    description: "Consulenziale, strategico, basato sugli insight",
    aiGuidance: "Evidenzia competenze, case study e ROI",
    contentTendencies: ["Strategico", "Analitico", "Consulenziale"],
  },
  educator: {
    id: "educator",
    name: "Formatore",
    description: "Orientato all'insegnamento, motivante, alla crescita",
    aiGuidance: "Dai priorità a momenti formativi, framework e sviluppo",
    contentTendencies: ["Educativo", "Motivante", "Di supporto"],
  },
  technical: {
    id: "technical",
    name: "Tecnico",
    description: "Orientato all'innovazione, dettagliato, problem-solver",
    aiGuidance: "Enfatizza tecnologia, soluzioni e profondità tecnica",
    contentTendencies: ["Tecnico", "Dettagliato", "Innovativo"],
  },
};

export type ContentStylePersonalityId = keyof typeof CONTENT_STYLE_PERSONALITIES;

// ────────────────────────────────────────────────────────────
// Photo Strategies
// ────────────────────────────────────────────────────────────

export const PHOTO_STRATEGIES = {
  real_photos: {
    id: "real_photos",
    name: "Foto Reali",
    description: "Contenuti autentici, personali, incentrati sulle persone con fotografia reale",
    aiGuidance: "Usa foto professionali di alta qualità e scatti spontanei",
    forWho: ["Personal brand", "Thought leader", "Coach"],
  },
  graphics: {
    id: "graphics",
    name: "Prevalenza Grafica",
    description: "Orientato al design, concettuale, metafore visive e illustrazioni",
    aiGuidance: "Genera o recupera grafiche personalizzate, icone e illustrazioni",
    forWho: ["Aziende B2B", "Founder tech", "Brand attenti al design"],
  },
  hybrid: {
    id: "hybrid",
    name: "Approccio Ibrido",
    description: "Mix di foto reali, grafiche, icone ed elementi visivi",
    aiGuidance: "Bilancia foto autentiche con grafiche strategiche ed elementi visivi",
    forWho: ["La maggior parte dei professionisti", "Consulenti", "Creatori di contenuti misti"],
  },
};

export type PhotoStrategyId = keyof typeof PHOTO_STRATEGIES;

// ────────────────────────────────────────────────────────────
// Background Styles
// ────────────────────────────────────────────────────────────

export const BACKGROUND_STYLES = {
  clean: {
    id: "clean",
    name: "Pulito",
    description: "Sfondo solido, rumore visivo minimo",
    css: "bg-white dark:bg-gray-950",
  },
  gradient: {
    id: "gradient",
    name: "Gradiente",
    description: "Sfondo sfumato sottile per interesse visivo",
    css: "bg-gradient-to-br from-white to-gray-50 dark:from-gray-950 dark:to-gray-900",
  },
  minimalist: {
    id: "minimalist",
    name: "Minimalista",
    description: "Ultra-semplice, colore unico con texture",
    css: "bg-gray-50 dark:bg-gray-900",
  },
};

export type BackgroundStyleId = keyof typeof BACKGROUND_STYLES;

// ────────────────────────────────────────────────────────────
// Curated Color Palettes
// ────────────────────────────────────────────────────────────

export const CURATED_COLOR_PALETTES = [
  {
    name: "Blu Innovazione",
    primary: "#0EA5E9",
    secondary: "#06B6D4",
    background: "clean",
    preset: "tech_modern",
  },
  {
    name: "Oro Legacy",
    primary: "#F59E0B",
    secondary: "#D97706",
    background: "clean",
    preset: "consulting_premium",
  },
  {
    name: "Verde Crescita",
    primary: "#10B981",
    secondary: "#059669",
    background: "clean",
    preset: "educational_coach",
  },
  {
    name: "Rosso Power",
    primary: "#DC2626",
    secondary: "#991B1B",
    background: "gradient",
    preset: "bold_founder",
  },
  {
    name: "Slate Executive",
    primary: "#1F2937",
    secondary: "#6366F1",
    background: "clean",
    preset: "minimal_corporate",
  },
  {
    name: "Viola Creativo",
    primary: "#A855F7",
    secondary: "#9333EA",
    background: "gradient",
    preset: "tech_modern",
  },
  {
    name: "Teal Fiducia",
    primary: "#0D9488",
    secondary: "#14B8A6",
    background: "clean",
    preset: "consulting_premium",
  },
  {
    name: "Arancione Founder",
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
