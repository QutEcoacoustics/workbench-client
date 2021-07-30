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
   * @param color Colour to modify
   * @param value New base value for colour (accepts most colour standards)
   */
  public setColor(color: ThemeColor, value: string): void {
    const hslValue = hsl(value);
    if (
      !hslValue ||
      isNaN(hslValue.h) ||
      isNaN(hslValue.s) ||
      isNaN(hslValue.l)
    ) {
      console.log(hslValue);
      console.warn(`Invalid theme color given for ${color} detected: ${value}`);
      return;
    }
    this.setCssColorProperty(color, hslValue);
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
   * Reset any modifications to a colour
   *
   * @param color Color to reset
   * @param hardReset Reset instance theme colour settings as well
   */
  public resetColor(color: ThemeColor, hardReset?: boolean): void {
    this.setCssColorProperty(color, null);

    if (!hardReset) {
      // Re-add instance changes to color
      this.customizeInstance(color);
    }
  }

  /**
   * Reset any modifications to the global theme
   *
   * @param hardReset Reset instance theme as well
   */
  public resetTheme(hardReset?: boolean): void {
    // Reset all colours
    this.themeColors.forEach((color) => this.setCssColorProperty(color, null));

    if (!hardReset) {
      // Re-add instance changes to theme
      this.customizeInstance();
    }
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

  /**
   * Apply the global theme of the website
   *
   * @param color Only apply the global theme to this colour
   */
  private customizeInstance(color?: ThemeColor): void {
    if (color) {
      this.setColor(color, this.theme[color]);
      return;
    }

    for (const themeColor of Object.keys(this.theme)) {
      this.setColor(themeColor as ThemeColor, this.theme[themeColor]);
    }
  }
}
