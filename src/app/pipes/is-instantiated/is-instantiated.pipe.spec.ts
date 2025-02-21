import { createPipeFactory, SpectatorPipe } from "@ngneat/spectator";
import { isInstantiatedPipe } from "./is-instantiated.pipe";

describe("isInstantiatedPipe", () => {
  let spec: SpectatorPipe<isInstantiatedPipe>;

  const createPipe = createPipeFactory(isInstantiatedPipe);

  function assertPipeIsFalse() {
    expect(spec.element).toHaveText("false");
  }

  function assertPipeIsTrue() {
    expect(spec.element).toHaveText("true");
  }

  function setup(value: unknown) {
    spec = createPipe("<p>{{ value | isInstantiated }}</p>", {
      hostProps: { value },
    });
  }

  it("should return false for undefined value", () => {
    setup(undefined);
    assertPipeIsFalse();
  });

  it("should return false for null value", () => {
    setup(null);
    assertPipeIsFalse();
  });

  it("should return true for empty string", () => {
    setup("");
    assertPipeIsTrue();
  });

  it("should return true for empty array", () => {
    setup([]);
    assertPipeIsTrue();
  });

  it("should return true for empty object", () => {
    setup({});
    assertPipeIsTrue();
  });

  it("should return true for number", () => {
    setup(0);
    assertPipeIsTrue();
  });

  it("should return true for boolean", () => {
    setup(false);
    assertPipeIsTrue();
  });
});
