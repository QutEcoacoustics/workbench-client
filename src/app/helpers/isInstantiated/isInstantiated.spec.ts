import { isInstantiated } from "./isInstantiated";

describe("isInstantiated", () => {
  it("should return true for instantiated values", () => {
    expect(isInstantiated(42)).toBeTrue();

    expect(isInstantiated(0)).toBeTrue();
    expect(isInstantiated(-0)).toBeTrue();
    expect(isInstantiated("")).toBeTrue();
    expect(isInstantiated(false)).toBeTrue();
    expect(isInstantiated({})).toBeTrue();
    expect(isInstantiated([])).toBeTrue();
    expect(isInstantiated(() => {})).toBeTrue();
    expect(isInstantiated(new Date())).toBeTrue();
    expect(isInstantiated(NaN)).toBeTrue();
  });

  it("should return false for uninstantiated values", () => {
    expect(isInstantiated(null)).toBeFalse();
    expect(isInstantiated(undefined)).toBeFalse();
  });
});
