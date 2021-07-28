import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";
import * as Color from "color";

/** List of palette options for website theming */
export enum BawPalettes {
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
enum BawVariants {
  base = "",
  lighter = "-lighter",
  lightest = "-lightest",
  darker = "-darker",
  darkest = "-darkest",
}

/** List of css variables associated with a variant of a palette */
interface BawThemeVariant {
  color: {
    base: string;
    hue: string;
    saturation: string;
    lightness: string;
  };
  contrast: {
    base: string;
    hue: string;
    saturation: string;
    lightness: string;
  };
}

/** List of palette options for website theming */
export type BawPaletteType = keyof typeof BawPalettes;
/** List of variants which exist for each palette */
export type BawVariantType = keyof typeof BawVariants;
type BawThemePalettes = { [Variant in BawVariantType]: BawThemeVariant };
type BawThemeVariables = { [Palette in BawPaletteType]: BawThemePalettes };
/** Configuration theme settings */
export type BawTheme = { [Palette in BawPaletteType]?: string };

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  /** Tracks config changes to theme */
  private theme: BawTheme;
  /** Tracks all theme variables */
  private _themeVariables: BawThemeVariables;
  /** Track modified palettes to allow us to handle resetting styles */
  private modifiedPalettes: Set<BawPalettes> = new Set();

  public constructor(@Inject(DOCUMENT) private document: Document) {}

  /**
   * Returns an object containing all of the css variables used by the website
   * theme
   */
  public get themeVariables(): BawThemeVariables {
    function getCssVariables(palette: BawPalettes, variant: BawVariants) {
      const colorBase = `--baw-${palette}${variant}`;
      const contrastBase = `${colorBase}-contrast`;

      return {
        color: {
          base: colorBase,
          hue: `${colorBase}-hue`,
          saturation: `${colorBase}-saturation`,
          lightness: `${colorBase}-lightness`,
        },
        contrast: {
          base: contrastBase,
          hue: `${contrastBase}-hue`,
          saturation: `${contrastBase}-saturation`,
          lightness: `${contrastBase}-lightness`,
        },
      };
    }

    // Generate list of theme variables on first access
    if (!this._themeVariables) {
      const theme: Partial<BawThemeVariables> = {};
      // Iterate through palettes
      for (const paletteKey in BawPalettes) {
        const palette: Partial<BawThemePalettes> = {};
        // Iterate through variants
        for (const variantKey in BawVariants) {
          // Save variant variables to palette
          palette[variantKey] = getCssVariables(
            BawPalettes[paletteKey],
            BawVariants[variantKey]
          );
        }
        // Save palette to theme
        theme[paletteKey] = palette as BawThemePalettes;
      }
      // Save theme for later use
      this._themeVariables = theme as BawThemeVariables;
    }

    return this._themeVariables;
  }

  /**
   * Set the base colour for a palette
   *
   * @param palette Palette to modify
   * @param colorString New base colour for palette (accepts most standards)
   */
  public setPalette(palette: BawPalettes, colorString: string): void {
    let hue: number;
    let saturation: number;
    let lightness: number;

    try {
      const color = Color.default(colorString);
      hue = color.hue();
      saturation = color.saturationl();
      lightness = color.lightness();
    } catch (e) {
      console.warn(
        `Invalid theme color given for ${palette} detected: ${colorString}`
      );
      return;
    }

    const root = this.document.documentElement;
    const baseColor = this.themeVariables[palette].base.color;
    root.style.setProperty(baseColor.hue, `${hue}deg`);
    root.style.setProperty(baseColor.saturation, `${saturation}%`);
    root.style.setProperty(baseColor.lightness, `${lightness}%`);
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
  public resetPalette(palette: BawPalettes, hardReset?: boolean): void {
    // If this palette was never modified, don't do anything
    if (!this.modifiedPalettes.has(palette)) {
      return;
    }

    const root = this.document.documentElement;
    const baseColor = this.themeVariables[palette].base.color;
    root.style.removeProperty(baseColor.hue);
    root.style.removeProperty(baseColor.saturation);
    root.style.removeProperty(baseColor.lightness);
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

  /**
   * Apply the global theme of the website
   *
   * @param palette Only apply the global theme to this palette
   */
  private customizeInstance(palette?: BawPalettes): void {
    if (palette) {
      this.setPalette(palette, this.theme[palette]);
      return;
    }

    for (const themePalette of Object.keys(this.theme)) {
      this.setPalette(themePalette as BawPalettes, this.theme[themePalette]);
    }
  }
}
