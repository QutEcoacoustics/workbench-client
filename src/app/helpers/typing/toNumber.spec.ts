import { toNumber } from "./toNumber";

describe("toNumber", () => {
  it("should parse a number correctly", () => {
    expect(toNumber("512.23")).toEqual(512.23);
  });

  it("should return null for non-number values", () => {
    expect(toNumber("hello world!")).toBeNull();
  });

  // If we used parseInt() in the number converter, we would get 123 here
  it("should return null for partial number values", () => {
    expect(toNumber("123 cats, 456 dogs")).toBeNull();
  });

  // If you use the Number constructor on whitespace string characters, the
  // number zero will be returned. We don't want this functionality.
  it("should return null for whitespace string characters", () => {
    expect(toNumber("")).toBeNull();
    expect(toNumber(" ")).toBeNull();
    expect(toNumber("\t")).toBeNull();
    expect(toNumber("\n")).toBeNull();
    expect(toNumber("\r")).toBeNull();
  });

  it("should return null for 'Infinity' string values", () => {
    expect(toNumber("Infinity")).toBeNull();
    expect(toNumber("-Infinity")).toBeNull();

    // Note that although the maximum integer is 1e+309, I use 1e+311 here to
    // ensure that we're not just matching against the maximum integer value or
    // a string value of "Infinity".
    expect(toNumber("1e+311")).toBeNull();
    expect(toNumber("-1e+311")).toBeNull();
  });
});
