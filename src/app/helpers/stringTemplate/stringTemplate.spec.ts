import { stringTemplate } from "./stringTemplate";

describe("StringTemplating", () => {
  it("should handle no tokens", () => {
    const template = stringTemplate`/broken_link`;

    expect(template).toBeTruthy();
    expect(template()).toBe("/broken_link");
  });

  it("should handle string token", () => {
    const stringCallback = (x: string) => x;
    const template = stringTemplate`/broken_link/${stringCallback}`;

    expect(template).toBeTruthy();
    expect(template("string")).toBe("/broken_link/string");
  });

  it("should handle number token", () => {
    const numberCallback = (x: number) => x;
    const template = stringTemplate`/broken_link/${numberCallback}`;

    expect(template).toBeTruthy();
    expect(template(42)).toBe("/broken_link/42");
  });

  it("should handle multiple string tokens", () => {
    const stringCallback = (x: string) => x;
    const template = stringTemplate`/broken_link/${stringCallback}/${stringCallback}`;

    expect(template).toBeTruthy();
    expect(template("ping", "pong")).toBe("/broken_link/ping/pong");
  });

  it("should handle multiple number tokens", () => {
    const numberCallback = (x: number) => x;
    const template = stringTemplate`/broken_link/${numberCallback}/${numberCallback}`;

    expect(template).toBeTruthy();
    expect(template(1, 2)).toBe("/broken_link/1/2");
  });

  it("should handle multiple different tokens", () => {
    const stringCallback = (x: string) => x;
    const numberCallback = (x: number) => x;
    const template = stringTemplate`/broken_link/${stringCallback}/${numberCallback}`;

    expect(template).toBeTruthy();
    expect(template("string", 42)).toBe("/broken_link/string/42");
  });
});
