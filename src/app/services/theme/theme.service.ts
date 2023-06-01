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
  private root: HTMLElement;

  public constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(IS_SERVER_PLATFORM) private isServer: boolean
  ) {
    // Read the root style of the website
    this.root = this.document.documentElement;
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
    this.setColor(colorName, null);

    // Re-add instance changes to color
    this.setColor(colorName, this.theme[colorName]);
  }

  /**
   * Reset any modifications to the global theme
   */
  public resetTheme(): void {
    this.themeColors.forEach((color) => this.setColor(color, null));
    this.setTheme(this.theme);
  }

  /**
   * Update the css colour property for the theme colour provided
   *
   * @param colorName Color to modify
   * @param color Base color value
   */
  public setColor(colorName: ThemeColor, color?: HSLColor | string): void {
    if (!this.isServer) {
      this.setColorInBrowser(colorName, color);
      return;
    }

    // Can only set color on SSR if it exists
    if (color) {
      this.setColorInSsr(colorName, color);
    }
  }

  private setColorInBrowser(
    colorName: ThemeColor,
    color?: HSLColor | string
  ): void {
    const { hue, saturation, lightness } = this.getCssVariables(colorName);

    if (!color) {
      this.root.style.removeProperty(hue);
      this.root.style.removeProperty(saturation);
      this.root.style.removeProperty(lightness);
      return;
    }

    const hslColor = typeof color === "string" ? hsl(color) : color;
    if (isNaN(hslColor.opacity)) {
      console.warn(
        `Invalid theme color given for ${colorName} detected: ${color}`
      );
      return;
    }

    this.root.style.setProperty(hue, `${this.readHslValue(hslColor.h)}deg`);
    this.root.style.setProperty(
      saturation,
      `${this.readHslValue(hslColor.s, true)}%`
    );
    this.root.style.setProperty(
      lightness,
      `${this.readHslValue(hslColor.l, true)}%`
    );
  }

  private setColorInSsr(colorName: ThemeColor, color: HSLColor | string): void {
    const { hue, saturation, lightness } = this.getCssVariables(colorName);
    const hslColor = typeof color === "string" ? hsl(color) : color;
    if (isNaN(hslColor.opacity)) {
      console.warn(
        `Invalid theme color given for ${colorName} detected: ${color}`
      );
      return;
    }

    const style = this.document.createElement("style");
    style.innerHTML = `
      :root {
        ${hue}: ${this.readHslValue(hslColor.h)}deg;
        ${saturation}: ${this.readHslValue(hslColor.s, true)}%;
        ${lightness}: ${this.readHslValue(hslColor.l, true)}%
      }
    `;
    this.document.head.appendChild(style);
  }

  private getCssVariables(colorName: ThemeColor) {
    const prefix = `--baw-${colorName}`;
    return {
      prefix,
      hue: `${prefix}-hue`,
      saturation: `${prefix}-saturation`,
      lightness: `${prefix}-lightness`,
    };
  }

  /**
   * Hsl conversion will return NaN instead of 0 for some valid values
   * because of https://github.com/d3/d3-color/issues/82
   *
   * @param value HSL hue, saturation, or light value
   * @param isPercentage True if value is a percentage
   * @returns Sanitized HSL value
   */
  private readHslValue(value: number, isPercentage?: boolean): string {
    if (isNaN(value)) {
      return "0.00";
    } else if (isPercentage) {
      return (value * 100).toFixed(2);
    } else {
      return value.toFixed(2);
    }
  }
}
