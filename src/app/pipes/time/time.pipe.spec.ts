import { createPipeFactory, SpectatorPipe } from "@ngneat/spectator";
import { Duration } from "luxon";
import { TimePipe } from "./time.pipe";

describe("TimePipe", () => {
  let spectator: SpectatorPipe<TimePipe>;
  const createPipe = createPipeFactory(TimePipe);

  function setup(value: Duration) {
    spectator = createPipe("<p>{{ value | time }}</p>", {
      hostProps: { value },
    });
  }

  it("should handle undefined value", () => {
    setup(undefined);
    expect(spectator.element).toHaveExactText("");
  });

  it("should handle null value", () => {
    setup(null);
    expect(spectator.element).toHaveExactText("");
  });

  it("should display duration in the correct format", () => {
    const hours = 2;
    const minutes = 41;
    // even though the standardized format doesn't include seconds
    // we should test that the pipe can handle them
    const seconds = 23;

    const duration = Duration.fromObject({ hours, minutes, seconds });

    setup(duration);
    expect(spectator.element).toHaveExactText("02:41");
  });
});
