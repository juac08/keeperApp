import type { Tag } from "@/types";

const TAG_COLOR_PRESETS: Record<string, string> = {
  bug: "red",
  enhancement: "green",
  feature: "blue",
  story: "purple",
  design: "blue",
  frontend: "purple",
  backend: "teal",
  testing: "yellow",
  documentation: "cyan",
  ui: "purple",
  ux: "blue",
  prototype: "green",
  feedback: "orange",
  assets: "pink",
  urgent: "orange",
  home: "blue",
  work: "purple",
  health: "green",
  learning: "orange",
  shopping: "pink",
  "social media": "blue",
  email: "green",
  content: "purple",
  seo: "orange",
  analytics: "cyan",
};

const TAG_GLYPH_PRESETS: Record<string, string> = {
  bug: "circle",
  story: "bookmark",
  task: "check",
  todo: "check",
  enhancement: "sparkle",
  feature: "sparkle",
  design: "diamond",
  testing: "flask",
  documentation: "document",
  feedback: "comment",
  ui: "diamond",
  ux: "diamond",
};

const JIRA_SWATCH_PRESETS: Record<string, string> = {
  red: "#DE350B",
  orange: "#FF8B00",
  yellow: "#FFAB00",
  green: "#36B37E",
  blue: "#2684FF",
  purple: "#6554C0",
  teal: "#00B8D9",
  pink: "#FF5CCC",
  cyan: "#00B8FF",
  gray: "#6B778C",
};

type TagPalette = {
  background: string;
  color: string;
  borderColor: string;
};

const JIRA_COLOR_PRESETS: Record<string, TagPalette> = {
  red: { background: "#FFEBE6", color: "#BF2600", borderColor: "#FFBDAD" },
  orange: {
    background: "#FFFAE6",
    color: "#974F0C",
    borderColor: "#FFE2A0",
  },
  yellow: {
    background: "#FFFAE6",
    color: "#7F5F01",
    borderColor: "#F8E6A0",
  },
  green: {
    background: "#E3FCEF",
    color: "#006644",
    borderColor: "#ABF5D1",
  },
  blue: { background: "#DEEBFF", color: "#0747A6", borderColor: "#C1DAF9" },
  purple: {
    background: "#EAE6FF",
    color: "#403294",
    borderColor: "#C0B6F2",
  },
  teal: {
    background: "#E6FCFF",
    color: "#0065A6",
    borderColor: "#B3F5FF",
  },
  pink: {
    background: "#FFEEF8",
    color: "#943D73",
    borderColor: "#FFB8D2",
  },
  cyan: {
    background: "#E6FCFF",
    color: "#0065FF",
    borderColor: "#B3F5FF",
  },
  gray: {
    background: "#F4F5F7",
    color: "#505F79",
    borderColor: "#DFE1E6",
  },
};

const DEFAULT_PALETTE = JIRA_COLOR_PRESETS.gray;
const DEFAULT_SWATCH = JIRA_SWATCH_PRESETS.gray;

export const CORE_TAG_PRESETS = ["Bug", "Enhancement", "Story", "Design"].map(
  (name) => ({
    name,
    color: TAG_COLOR_PRESETS[name.toLowerCase()] ?? "gray",
  }),
);

const capitalizeWords = (value: string) =>
  value
    .split(/([\s_-]+)/)
    .map((segment) =>
      /[\s_-]+/.test(segment)
        ? segment
        : segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase(),
    )
    .join("")
    .replace(/[\s_-]+/g, " ");

const hexToRgb = (hex: string) => {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) return null;
  const r = parseInt(normalized.substring(0, 2), 16);
  const g = parseInt(normalized.substring(2, 4), 16);
  const b = parseInt(normalized.substring(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
  return { r, g, b };
};

const rgbToHex = (r: number, g: number, b: number) =>
  `#${[r, g, b]
    .map((value) => Math.max(0, Math.min(255, value)))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;

const mixColor = (hex: string, opacity: number) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return DEFAULT_PALETTE.background;
  const background = { r: 255, g: 255, b: 255 };
  const r = Math.round(opacity * rgb.r + (1 - opacity) * background.r);
  const g = Math.round(opacity * rgb.g + (1 - opacity) * background.g);
  const b = Math.round(opacity * rgb.b + (1 - opacity) * background.b);
  return rgbToHex(r, g, b);
};

const buildPaletteFromHex = (hex: string): TagPalette => {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    return DEFAULT_PALETTE;
  }
  return {
    background: mixColor(hex, 0.25),
    color: rgbToHex(
      Math.round(rgb.r * 0.7),
      Math.round(rgb.g * 0.7),
      Math.round(rgb.b * 0.7),
    ),
    borderColor: mixColor(hex, 0.45),
  };
};

export const getTagMeta = (tag: Tag) => {
  const rawName = tag.name || "Tag";
  const normalized = rawName.trim().toLowerCase();
  const presetColor = TAG_COLOR_PRESETS[normalized];
  const explicitColor = tag.color?.trim().toLowerCase();

  let colorKey: string | undefined;
  let palette: TagPalette = DEFAULT_PALETTE;
  let swatch = DEFAULT_SWATCH;

  if (explicitColor && !explicitColor.startsWith("#")) {
    colorKey = explicitColor;
  } else if (presetColor) {
    colorKey = presetColor;
  }

  if (explicitColor && explicitColor.startsWith("#")) {
    palette = buildPaletteFromHex(explicitColor);
    swatch = explicitColor;
  } else if (colorKey && JIRA_COLOR_PRESETS[colorKey]) {
    palette = JIRA_COLOR_PRESETS[colorKey];
    swatch = JIRA_SWATCH_PRESETS[colorKey] ?? DEFAULT_SWATCH;
  }

  const label = capitalizeWords(rawName).toUpperCase();
  const colorName =
    colorKey ??
    (explicitColor && explicitColor.startsWith("#") ? "custom" : "gray");
  const glyph = TAG_GLYPH_PRESETS[normalized] ?? "dot";

  return {
    label,
    colorName,
    glyph,
    swatch,
    ...palette,
  };
};
