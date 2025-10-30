import { computed, signal } from "@angular/core";
import { unwrapPotentialSignal } from "./signals";

describe("unwrapPotentialSignal", () => {
  it("should return a value as-is", () => {
    const falsyValue = 0;
    expect(unwrapPotentialSignal(falsyValue)).toEqual(falsyValue);

    const truthyValue = "Hello World!";
    expect(unwrapPotentialSignal(truthyValue)).toEqual(truthyValue);
  });

  it("should unwrap a signal value", () => {
    const falsySignalValue = signal(0);
    expect(unwrapPotentialSignal(falsySignalValue)).toEqual(0);

    const truthySignalValue = signal(42);
    expect(unwrapPotentialSignal(truthySignalValue)).toEqual(42);
  });

  it("should work with computed signals", () => {
    const baseSignal = signal(10);
    const computedSignal = computed(() => baseSignal() * 2);

    expect(unwrapPotentialSignal(computedSignal)).toEqual(20);
    baseSignal.set(25);

    expect(unwrapPotentialSignal(computedSignal)).toEqual(50);
  })
});
