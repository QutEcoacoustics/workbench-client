import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";
import { hsl, HSLColor } from "d3-color";

const themeColors = [
  "highlight",
  "primary",
  "secondary",
  "success",
  "info",
  "warning",
  "danger",
  "light",
  "dark",
] as const;
export type ThemeColor = typeof themeColors[number];

const themeVariants = [
  "",
  "-lighter",
  "-lightest",
  "-darker",
  "-darkest",
] as const;
export type ThemeVariant = typeof themeVariants[number];

/** Configuration theme settings */
export type BawTheme = { [color in ThemeColor]?: string };

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  /** List of colour options in theme */
  public themeColors = themeColors;
  /** List of variants for each colour option in theme */
  public themeVariants = themeVariants;

  /** Tracks config changes to theme */
  private theme: BawTheme;
  /** Stored styles of the website */
  private style: CSSStyleDeclaration;

  public constructor(@Inject(DOCUMENT) private document: Document) {
    // Read the root style of the website
    this.style = this.document.documentElement.style;
  }

  /**
   * Set the base colour for a colour
   *
   * @param colorName Colour to modify
   * @param color New base value for colour (accepts most colour standards)
   */
  public setColor(colorName: ThemeColor, color: string): void {
    const hslValue = hsl(color);
    if (
      !hslValue ||
      isNaN(hslValue.h) ||
      isNaN(hslValue.s) ||
      isNaN(hslValue.l)
    ) {
      console.warn(
        `Invalid theme color given for ${colorName} detected: ${color}`
      );
      return;
    }
    this.setCssColorProperty(colorName, hslValue);
  }

  /**
   * Set the global theme of the website
   *
   * @param theme Theme of website
   */
  public setTheme(theme: BawTheme): void {
    this.theme = theme;

    // Re-add instance changes to theme
    for (const themeColor of Object.keys(this.theme)) {
      this.setColor(themeColor as ThemeColor, this.theme[themeColor]);
    }
  }

  /**
   * Reset any modifications to a colour
   *
   * @param colorName Color to reset
   */
  public resetColor(colorName: ThemeColor): void {
    this.setCssColorProperty(colorName, null);

    // Re-add instance changes to color
    this.setColor(colorName, this.theme[colorName]);
  }

  /**
   * Reset any modifications to the global theme
   */
  public resetTheme(): void {
    this.themeColors.forEach((color) => this.setCssColorProperty(color, null));
    this.setTheme(this.theme);
  }

  /**
   * Update the css colour property for the theme colour provided
   *
   * @param color Color to modify
   * @param value Base color value
   */
  private setCssColorProperty(color: ThemeColor, value?: HSLColor): void {
    const prefix = `--baw-${color}`;
    const hue = `${prefix}-hue`;
    const saturation = `${prefix}-saturation`;
    const lightness = `${prefix}-lightness`;
    const toPercentage = (fraction: number) => fraction * 100;

    if (value) {
      this.style.setProperty(hue, `${value.h}deg`);
      this.style.setProperty(saturation, `${toPercentage(value.s)}%`);
      this.style.setProperty(lightness, `${toPercentage(value.l)}%`);
    } else {
      this.style.removeProperty(hue);
      this.style.removeProperty(saturation);
      this.style.removeProperty(lightness);
    }
  }
}
