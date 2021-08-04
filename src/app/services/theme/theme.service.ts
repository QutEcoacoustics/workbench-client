import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";
import { hsl, HSLColor } from "d3-color";
import { IS_SERVER_PLATFORM } from "src/app/app.helper";

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

  public constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(IS_SERVER_PLATFORM) private isServer: boolean
  ) {
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

    if (isNaN(hslValue.opacity)) {
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
  public setTheme(theme: BawTheme = {}): void {
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
   * @param colorName Color to modify
   * @param color Base color value
   */
  private setCssColorProperty(colorName: ThemeColor, color?: HSLColor): void {
    // Hsl conversion will return NaN instead of 0 for some valid values
    // because of https://github.com/d3/d3-color/issues/82
    function readHslValue(value: number, isPercentage?: boolean): string {
      if (isNaN(value)) {
        return "0.00";
      } else if (isPercentage) {
        return (value * 100).toFixed(2);
      } else {
        return value.toFixed(2);
      }
    }

    const prefix = `--baw-${colorName}`;
    const hue = `${prefix}-hue`;
    const saturation = `${prefix}-saturation`;
    const lightness = `${prefix}-lightness`;

    if (this.isServer) {
      return;
    }

    if (color) {
      this.style.setProperty(hue, `${readHslValue(color.h)}deg`);
      this.style.setProperty(saturation, `${readHslValue(color.s, true)}%`);
      this.style.setProperty(lightness, `${readHslValue(color.l, true)}%`);
    } else {
      this.style.removeProperty(hue);
      this.style.removeProperty(saturation);
      this.style.removeProperty(lightness);
    }
  }
}