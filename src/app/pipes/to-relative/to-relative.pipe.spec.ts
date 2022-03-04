import { HumanizeDurationOptions } from "@interfaces/apiInterfaces";
import { createPipeFactory, SpectatorPipe } from "@ngneat/spectator";
import { DateTime, Duration, ToRelativeOptions } from "luxon";
import { ToRelativePipe } from "./to-relative.pipe";

describe("ToRelativePipe", () => {
  let spec: SpectatorPipe<ToRelativePipe>;
  const createPipe = createPipeFactory(ToRelativePipe);

  function assertPipe(value: string) {
    expect(spec.element).toHaveText(value);
  }

  function setup(
    value: Duration | DateTime,
    options?: HumanizeDurationOptions | ToRelativeOptions
  ) {
    spec = createPipe("<p>{{ value | toRelative: options }}</p>", {
      hostProps: { value, options },
    });
  }

  it("should handle undefined value", () => {
    setup(undefined);
    assertPipe("(no value)");
  });

  it("should handle null value", () => {
    setup(undefined);
    assertPipe("(no value)");
  });

  it("should display duration", () => {
    setup(Duration.fromISO("PT28M37.957S"));
    assertPipe("28 minutes, 37.957 seconds");
  });

  it("should display duration with custom options", () => {
    setup(Duration.fromISO("PT28M37.957S"), { round: true });
    assertPipe("28 minutes, 38 seconds");
  });

  it("should display datetime", () => {
    setup(DateTime.utc());
    assertPipe("0 seconds ago");
  });

  it("should display datetime with custom options", () => {
    setup(DateTime.utc(), { style: "short" });
    assertPipe("0 sec. ago");
  });
});
