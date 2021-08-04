import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { DeviceDetectorService } from "ngx-device-detector";
import { ThemeColor, ThemeService } from "./theme.service";

const themeColors: ThemeColor[] = [
  "highlight",
  "primary",
  "secondary",
  "success",
  "info",
  "warning",
  "danger",
  "light",
  "dark",
];

describe("ThemeService", () => {
  let isFirefox: boolean;
  let spec: SpectatorService<ThemeService>;
  const createService = createServiceFactory(ThemeService);
  const defaultColorName: ThemeColor = "highlight";
  const defaultRgb = "#FFD500";
  const defaultHsl = { h: 50.12, s: 100, l: 50 };

  function assertCssColorUnset(colorName: ThemeColor) {
    const prefix = `--baw-${colorName}`;
    const hue = `${prefix}-hue`;
    const saturation = `${prefix}-saturation`;
    const lightness = `${prefix}-lightness`;

    const style = document.documentElement.style;
    expect(style.getPropertyValue(hue)).toBe("");
    expect(style.getPropertyValue(saturation)).toBe("");
    expect(style.getPropertyValue(lightness)).toBe("");
  }

  function assertCssColor(
    colorName: ThemeColor,
    color: { h: number; s: number; l: number }
  ) {
    const prefix = `--baw-${colorName}`;
    const hue = `${prefix}-hue`;
    const saturation = `${prefix}-saturation`;
    const lightness = `${prefix}-lightness`;

    function readHslValue(value: number) {
      return isFirefox ?  value.toFixed(2) : value;
    }

    const style = document.documentElement.style;
    expect(style.getPropertyValue(hue)).toBe(`${readHslValue(color.h)}deg`);
    expect(style.getPropertyValue(saturation)).toBe(`${readHslValue(color.s)}%`);
    expect(style.getPropertyValue(lightness)).toBe(`${readHslValue(color.l)}%`);
  }

  beforeEach(() => {
    spec = createService();

    // Styles are not reset between tests, so we reset here
    spec.service.resetTheme();
    isFirefox = spec.inject(DeviceDetectorService).browser === "Firefox";
  });

  it("should be created", () => {
    expect(spec.service).toBeTruthy();
  });

  describe("setColor", () => {
    themeColors.forEach((colorName: ThemeColor) => {
      it(`should set ${colorName} css color when given text value`, () => {
        spec.service.setColor(colorName, "steelblue");
        assertCssColor(colorName, { h: 207.27, s: 44, l: 49.02 });
      });

      it(`should set ${colorName} css color when given rgb value`, () => {
        spec.service.setColor(colorName, defaultRgb);
        assertCssColor(colorName, defaultHsl);
      });

      it(`should set ${colorName} css color when given hsl value`, () => {
        spec.service.setColor(colorName, "hsl(50.1176, 100%, 50%)");
        assertCssColor(colorName, defaultHsl);
      });
    });

    it("should override existing css color", () => {
      spec.service.setColor(defaultColorName, "#000");
      spec.service.setColor(defaultColorName, defaultRgb);
      assertCssColor(defaultColorName, defaultHsl);
    });

    it("should not set css color if invalid color value provided", () => {
      spec.service.setColor(defaultColorName, defaultRgb);
      spec.service.setColor(defaultColorName, "#fbg");
      assertCssColor(defaultColorName, defaultHsl);
    });

    it("should set css color if hsl has NaN values", () => {
      // #fafafa converts to a hsl value with a hue of NaN
      spec.service.setColor(defaultColorName, "#fafafa");
      assertCssColor(defaultColorName, { h: 0, l: 98.04, s: 0 });
    });
  });

  describe("setTheme", () => {
    it("should not set any colours if no themes are set", () => {
      spec.service.setTheme({});
      themeColors.forEach((themeColor) => assertCssColorUnset(themeColor));
    });

    it("should set colour if theme has a single value", () => {
      spec.service.setTheme({ [themeColors[0]]: defaultRgb });
      assertCssColor(themeColors[0], defaultHsl);
      themeColors
        .slice(1)
        .forEach((themeColor) => assertCssColorUnset(themeColor));
    });

    it("should set colours if theme has multiple values", () => {
      spec.service.setTheme({
        [themeColors[0]]: defaultRgb,
        [themeColors[1]]: defaultRgb,
      });
      assertCssColor(themeColors[0], defaultHsl);
      assertCssColor(themeColors[1], defaultHsl);
      themeColors
        .slice(2)
        .forEach((themeColor) => assertCssColorUnset(themeColor));
    });
  });

  describe("resetColor", () => {
    it("should reset colour", () => {
      spec.service.setColor("highlight", defaultRgb);
      spec.service.setColor("primary", defaultRgb);
      spec.service.resetColor("highlight");

      assertCssColorUnset("highlight");
      assertCssColor("primary", defaultHsl);
    });

    it("should reset to theme colours", () => {
      spec.service.setTheme({ highlight: defaultRgb });
      spec.service.setColor("highlight", "#111");
      spec.service.resetColor("highlight");
      assertCssColor("highlight", defaultHsl);
    });
  });

  describe("resetTheme", () => {
    it("should reset all colours", () => {
      spec.service.setColor("highlight", defaultRgb);
      spec.service.setColor("primary", defaultRgb);
      spec.service.resetTheme();

      assertCssColorUnset("highlight");
      assertCssColorUnset("primary");
    });

    it("should reset to theme colours", () => {
      spec.service.setTheme({ highlight: defaultRgb });
      spec.service.setColor("highlight", "#111");
      spec.service.setColor("primary", defaultRgb);
      spec.service.resetTheme();

      assertCssColor("highlight", defaultHsl);
      assertCssColorUnset("primary");
    });
  });
});
