import { SpectatorPipe, createPipeFactory } from "@ngneat/spectator";
import { DateTime } from "luxon";
import { DatePipe } from "@angular/common"; // Import the DatePipe from Angular common module
import { DateTimePipe } from "./date.pipe";

describe("DatePipe", () => {
  let spectator: SpectatorPipe<DateTimePipe>;
  const createPipe = createPipeFactory({
    pipe: DateTimePipe,
    providers: [DatePipe],
  });

  function setup(value: DateTime) {
    spectator = createPipe("<p>{{ value | dateTime }}</p>", {
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

  it("should display date in the correct format", () => {
    const date = DateTime.fromObject({ year: 2020, month: 1, day: 1 });

    setup(date);
    expect(spectator.element).toHaveExactText("2020-01-01");
  });
});
