import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";
import { IS_SERVER_PLATFORM } from "src/app/app.helper";

export const bawThemes = [
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

export const bawThemeVariants = [
  "",
  "-lighter",
  "-lightest",
  "-darker",
  "-darkest",
] as const;

export type BawTheme = typeof bawThemes[number];
export type BawThemeVariant = typeof bawThemeVariants[number];

export interface RGB {
  red: number;
  green: number;
  blue: number;
}

export interface HSL {
  hue: number;
  saturation: number;
  lightness: number;
}

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  public constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(IS_SERVER_PLATFORM) private isServer: boolean
  ) {}

  /**
   * Set the base colour for a theme
   *
   * @param theme Theme to modify
   * @param color New base colour for theme
   */
  public setTheme(theme: BawTheme, color: string): void {
    if (!this.validateHexRgb(color)) {
      console.warn(`Invalid theme color given for ${theme} detected: ${color}`);
      return;
    }

    const hsl = this.rgb2hsl(color);
    this.updateTheme(
      theme,
      `
        :root {
          --baw-${theme}-hue: ${hsl.hue}deg;
          --baw-${theme}-saturation: ${hsl.saturation}%;
          --baw-${theme}-lightness: ${hsl.lightness}%;
        }
      `
    );
  }

  /**
   * Reset any modifications to the base colour of a theme
   * ! This includes changes set by the environment
   *
   * @param theme Theme to reset
   */
  public resetTheme(theme: BawTheme): void {
    const style = this.document.getElementById(this.getThemeId(theme));
    if (style) {
      this.document.head.removeChild(style);
    }
  }

  /**
   * Update a theme by either inserting, or modifying, a style in the header
   *
   * @param theme Theme to update
   * @param styles CSS styles to apply
   */
  private updateTheme(theme: BawTheme, styles: string): void {
    const id = this.getThemeId(theme);

    // Get style element
    let style = this.document.getElementById(id) as HTMLStyleElement;
    if (style) {
      style.innerHTML = styles;
      return;
    }

    // Create style element if not exists
    style = this.document.createElement("style");
    style.id = id;
    style.innerHTML = styles;
    this.document.head.appendChild(style);
  }

  public extractHexRgb(hex: string): RGB {
    const color: RGB = { red: 0, green: 0, blue: 0 };

    /**
     * Extract hex string and convert to int using base 16
     */
    function extractHex(...chars: [number, number]): number {
      const value = hex.charAt(chars[0]) + hex.charAt(chars[1]);
      return parseInt(value, 16);
    }

    if (hex.length === 7) {
      color.red = extractHex(1, 2);
      color.green = extractHex(3, 4);
      color.blue = extractHex(5, 6);
    } else {
      color.red = extractHex(1, 1);
      color.green = extractHex(2, 2);
      color.blue = extractHex(3, 3);
    }

    return color;
  }

  /**
   * Convert rgb hex string into an object containing the hue, saturation and
   * lightness of the colour
   *
   * @param color RGB hex string to convert
   * @returns HSL colour equivalent to rgb
   */
  private rgb2hsl(color: string): HSL {
    const rgb = this.extractHexRgb(color);
    const red = rgb.red / 255; // Convert to decimal percentage
    const green = rgb.green / 255; // Convert to decimal percentage
    const blue = rgb.blue / 255; // Convert to decimal percentage

    const maxColor = Math.max(red, green, blue);
    const minColor = Math.min(red, green, blue);
    const deltaColor = maxColor - minColor;

    //Calculate lightness:
    let lightness = (maxColor + minColor) / 2;
    let saturation = 0;
    let hue = 0;

    if (maxColor !== minColor) {
      //Calculate saturation:
      saturation =
        deltaColor === 0 ? 0 : deltaColor / (1 - Math.abs(2 * lightness - 1));

      //Calculate hue:
      if (red === maxColor) {
        hue = (green - blue) / deltaColor; // between yellow & magenta
      } else if (green === maxColor) {
        hue = 2.0 + (blue - red) / deltaColor; // between cyan & yellow
      } else {
        hue = 4.0 + (red - green) / deltaColor; // between magenta & cyan
      }
    }

    // Normalize values
    lightness *= 100; // Convert to percentage
    saturation *= 100; // Convert to percentage
    hue *= 60; // Convert to degrees
    if (hue < 0) {
      hue += 360;
    }

    return { hue, saturation, lightness };
  }

  /**
   * Create a unique id for the HTMLStyleElement
   *
   * @param theme Theme which is being overriden
   * @returns ID string
   */
  private getThemeId(theme: BawTheme): string {
    return `baw-override-${theme}`;
  }

  /**
   * Validate whether the colour is a valid hexadecimal rgb value
   *
   * @param hex Hex string, either 6 characters (#ABCABC) or 3 characters (#ABC)
   * @returns True if hex is valid
   */
  private validateHexRgb(hex: string): boolean {
    const validHex = /^#([0-9A-F]{3}){1,2}$/i;
    return validHex.test(hex);
  }
}
