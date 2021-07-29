import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";
import * as Color from "color";

/** List of palette options for website theming */
export enum BawThemeColors {
  highlight = "highlight",
  primary = "primary",
  secondary = "secondary",
  success = "success",
  info = "info",
  warning = "warning",
  danger = "danger",
  light = "light",
  dark = "dark",
}

/** List of variants which exist for each palette */
enum BawColorVariants {
  base = "",
  lighter = "-lighter",
  lightest = "-lightest",
  darker = "-darker",
  darkest = "-darkest",
}

/** List of css variables associated with a variant of a palette */
interface BawThemeVariant {
  color: string;
  contrast: string;
}

/** List of palette options for website theming */
export type BawPaletteType = keyof typeof BawThemeColors;
/** List of variants which exist for each palette */
export type BawVariantType = keyof typeof BawColorVariants;
type BawThemePalettes = { [Variant in BawVariantType]: BawThemeVariant };
type BawThemeVariables = { [Palette in BawPaletteType]: BawThemePalettes };
/** Configuration theme settings */
export type BawTheme = { [Palette in BawPaletteType]?: string };

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  /** Tracks all theme variables */
  public themeVariables: BawThemeVariables;
  /** Tracks config changes to theme */
  private theme: BawTheme;
  /** Track modified palettes to allow us to handle resetting styles */
  private modifiedPalettes: Set<BawThemeColors> = new Set();
  /** Stored styles of the website */
  private style: CSSStyleDeclaration;

  public constructor(@Inject(DOCUMENT) private document: Document) {
    // Read the root style of the website
    this.style = this.document.documentElement.style;

    // Generate list of theme variables
    const theme: Partial<BawThemeVariables> = {};
    // Iterate through palettes
    for (const paletteKey in BawThemeColors) {
      const palette: Partial<BawThemePalettes> = {};
      // Iterate through variants
      for (const variantKey in BawColorVariants) {
        const color = `--baw-${BawThemeColors[paletteKey]}${BawColorVariants[variantKey]}`;
        palette[variantKey] = { color, contrast: `${color}-contrast` };
      }
      // Save palette to theme
      theme[paletteKey] = palette as BawThemePalettes;
    }
    // Save theme for later use
    this.themeVariables = theme as BawThemeVariables;
  }

  /**
   * Set the base colour for a palette
   *
   * @param palette Palette to modify
   * @param colorString New base colour for palette (accepts most standards)
   */
  public setPalette(palette: BawThemeColors, colorString: string): void {
    let color: Color;

    try {
      color = Color.default(colorString);
    } catch (e) {
      console.warn(
        `Invalid theme color given for ${palette} detected: ${colorString}`
      );
      return;
    }

    this.setCssColorProperty(palette, color);
    this.modifiedPalettes.add(palette);
  }

  /**
   * Set the global theme of the website
   *
   * @param theme Theme of website
   */
  public setTheme(theme: BawTheme): void {
    this.theme = theme;
    this.customizeInstance();
  }

  /**
   * Reset any modifications to a palette
   *
   * @param palette Palette to reset
   * @param hardReset Reset instance theme palette settings as well
   */
  public resetPalette(palette: BawThemeColors, hardReset?: boolean): void {
    // If this palette was never modified, don't do anything
    if (!this.modifiedPalettes.has(palette)) {
      return;
    }

    this.setCssColorProperty(palette, null);
    this.modifiedPalettes.delete(palette);

    if (!hardReset) {
      // Re-add instance changes to palette
      this.customizeInstance(palette);
    }
  }

  /**
   * Reset any modifications to the global theme
   *
   * @param hardReset Reset instance theme as well
   */
  public resetTheme(hardReset?: boolean): void {
    // Reset all palettes
    this.modifiedPalettes.forEach((palette) =>
      this.resetPalette(palette, true)
    );
    this.modifiedPalettes = new Set();

    if (!hardReset) {
      // Re-add instance changes to theme
      this.customizeInstance();
    }
  }

  private setCssColorProperty(palette: string, color?: Color): void {
    const prefix = `--baw-${palette}`;
    const hue = `${prefix}-hue`;
    const saturation = `${prefix}-saturation`;
    const lightness = `${prefix}-lightness`;

    if (color) {
      this.style.setProperty(hue, `${color.hue()}deg`);
      this.style.setProperty(saturation, `${color.saturationl()}%`);
      this.style.setProperty(lightness, `${color.lightness()}%`);
    } else {
      this.style.removeProperty(hue);
      this.style.removeProperty(saturation);
      this.style.removeProperty(lightness);
    }
  }

  /**
   * Apply the global theme of the website
   *
   * @param palette Only apply the global theme to this palette
   */
  private customizeInstance(palette?: BawThemeColors): void {
    if (palette) {
      this.setPalette(palette, this.theme[palette]);
      return;
    }

    for (const themePalette of Object.keys(this.theme)) {
      this.setPalette(themePalette as BawThemeColors, this.theme[themePalette]);
    }
  }
}
