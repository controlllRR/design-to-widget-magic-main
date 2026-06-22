/**
 * Toolbar icon buttons — Figma `674:4760` / nodes `674:4762`–`674:4765`.
 * Exported via MCP figma-bridge (SVG).
 */
import btnShare from "@/assets/generation/toolbar/btn-share.svg";
import btnSettings from "@/assets/generation/toolbar/btn-settings.svg";
import btnChangeBackground from "@/assets/generation/toolbar/btn-change-background.svg";
import btnAnimate from "@/assets/generation/toolbar/btn-animate.svg";

export const GENERATION_TOOLBAR_ICONS = {
  share: btnShare,
  settings: btnSettings,
  changeBackground: btnChangeBackground,
  animate: btnAnimate,
} as const;

export const GENERATION_TOOLBAR_FIGMA_NODES = {
  frame: "674:4760",
  share: "674:4762",
  settings: "674:4763",
  changeBackground: "674:4764",
  animate: "674:4765",
} as const;
