import { SpectatorPipe, createPipeFactory } from "@ngneat/spectator";
import { DateTime, Settings } from "luxon";
import { DatePipe } from "@angular/common"; // Import the DatePipe from Angular common module
import { DateTimePipe, DateTimePipeOptions } from "./date.pipe";

describe("DatePipe", () => {
  let spectator: SpectatorPipe<DateTimePipe>;
  const createPipe = createPipeFactory({
    pipe: DateTimePipe,
    providers: [DatePipe],
  });

  function setup(value: DateTime, options?: DateTimePipeOptions) {
    spectator = createPipe("<p>{{ value | dateTime : options }}</p>", {
      hostProps: { value, options },
    });
  }

  beforeEach(() => {
    // we do this so that the tests are not affected by the timezone of the user running the tests
    // if this is not done correctly, the tests will fail in CI
    const mockUserTimeZone = "Australia/Perth"; // +08:00 UTC
    Settings.defaultZone = mockUserTimeZone;
  });

  it("should handle undefined value", () => {
    setup(undefined);
    expect(spectator.element).toHaveExactText("");
  });

  it("should handle null value", () => {
    setup(null);
    expect(spectator.element).toHaveExactText("");
  });

  it("should display date in the correct format for utc dates", () => {
    const date = DateTime.fromObject({ year: 2020, month: 1, day: 1 });

    setup(date);
    expect(spectator.element).toHaveExactText("2020-01-01");
  });

  it("should emit times if 'includeTime' is set", () => {
    const expectedDateTime = "2020-01-01 18:43:11";
    const date = DateTime.fromObject({
      year: 2020,
      month: 1,
      day: 1,
      hour: 18,
      minute: 43,
      second: 11,
    });

    setup(date, { includeTime: true });
    expect(spectator.element).toHaveExactText(expectedDateTime);
  });

  it("should emit dateTime's in the correct format for local dates", () => {
    const inputDateTime = DateTime.fromISO("2020-01-01T00:00:00.000Z");
    const expectedDateTime = "2020-01-01 08:00:00";

    setup(inputDateTime, { includeTime: true, localTime: true });
    expect(spectator.element).toHaveExactText(expectedDateTime);
  });
});
