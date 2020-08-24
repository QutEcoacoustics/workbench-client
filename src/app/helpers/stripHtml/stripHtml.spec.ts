import { createSpyObject } from "@ngneat/spectator";
import { stripHtml } from "./stripHtml";

describe("StripHtml", () => {
  it("should return empty string when html undefined", () => {
    expect(stripHtml(undefined)).toBe("");
  });

  it("should return empty string when html is empty string", () => {
    expect(stripHtml("")).toBe("");
  });

  it("should handle normal string", () => {
    expect(stripHtml("normal string")).toBe("normal string");
  });

  it("should handle html string", () => {
    expect(stripHtml("<b>normal string</b>")).toBe("normal string");
  });
});
