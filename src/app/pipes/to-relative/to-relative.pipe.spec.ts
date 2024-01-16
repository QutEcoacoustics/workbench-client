import { HumanizeDurationOptions } from "@interfaces/apiInterfaces";
import { createPipeFactory, SpectatorPipe } from "@ngneat/spectator";
import { DateTime, Duration, ToRelativeOptions } from "luxon";
import { withDefaultZone } from "@test/helpers/mocks";
import { ToRelativePipe } from "./to-relative.pipe";

describe("ToRelativePipe", () => {
  let spec: SpectatorPipe<ToRelativePipe>;
  const createPipe = createPipeFactory(ToRelativePipe);

  function assertPipe(value: string | string[] | ((text: string) => boolean)) {
    expect(spec.element).toHaveExactText(value);
  }

  function setup(
    value: Duration | DateTime,
    options?: HumanizeDurationOptions | ToRelativeOptions
  ) {
    spec = createPipe("<p>{{ value | toRelative: options }}</p>", {
      hostProps: { value, options },
    });
  }

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date("2020-01-01T00:00:00.000+09:30"));
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it("should handle undefined value", () => {
    setup(undefined);
    assertPipe("(no value)");
  });

  it("should handle null value", () => {
    setup(null);
    assertPipe("(no value)");
  });

  it("should display duration", () => {
    setup(Duration.fromISO("PT28M37.957S"));
    assertPipe("28 minutes 37.957 seconds");
  });

  it("should display duration with custom options", () => {
    setup(Duration.fromISO("PT28M37.957S"), { round: true });
    assertPipe("28 minutes 38 seconds");
  });

  withDefaultZone("Australia/Darwin", () => {
    it("should display current datetime", () => {
      setup(DateTime.fromISO("2020-01-01T00:00:00.000"));
      assertPipe("in 0 seconds");
    });

    it("should display current datetime with custom options", () => {
      setup(DateTime.fromISO("2020-01-01T00:00:00.000"), { style: "short" });
      assertPipe("in 0 sec.");
    });

    it("should display a past datetime", () => {
      setup(DateTime.fromISO("2019-12-31T21:59:59.000"));
      assertPipe("2 hours ago");
    });

    it("should display a past datetime with custom options", () => {
      setup(DateTime.fromISO("2019-12-31T21:59:59.000"), { style: "short" });
      assertPipe("2 hr. ago");
    });
  });
});
