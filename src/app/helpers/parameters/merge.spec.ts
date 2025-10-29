import { Params } from "@angular/router";
import { mergeParameters } from "./merge";

describe("mergeParameters", () => {
  it("should emit the base object when no overrides are provided", () => {
    const base: Params = { greeting: "hello", name: "world" };
    const result = mergeParameters(base);
    expect(result).toEqual(base);
  });

  it("should emit the base object when an empty override is provided", () => {
    const base: Params = { greeting: "hello", name: "world" };
    const result = mergeParameters(base, {});
    expect(result).toEqual(base);
  });

  it("should merge overrides correctly", () => {
    const base: Params = { greeting: "hello", name: "world" };
    const override1: Params = { greeting: "hi", age: 30 };
    const override2: Params = { country: "Australia" };

    const result = mergeParameters(base, override1, override2);

    expect(result).toEqual({
      greeting: "hi",
      name: "world",
      age: 30,
      country: "Australia",
    });
  });

  it("should be able to overwrite a parameter with 'null'", () => {
    const base: Params = { greeting: "hello", name: "world" };
    const override: Params = { name: null };

    const result = mergeParameters(base, override);

    expect(result).toEqual({ greeting: "hello", name: null });
  });
});
