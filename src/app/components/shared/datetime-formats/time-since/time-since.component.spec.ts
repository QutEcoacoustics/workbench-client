import { modelData } from "@test/helpers/faker";
import { DateTime, Duration } from "luxon";
import { assertTooltip } from "@test/helpers/html";
import { withDefaultZone } from "@test/helpers/mocks";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { provideMockBawApi } from "@baw-api/provide-bawApiMock";
import { TimeSinceComponent } from "./time-since.component";

// I have created this interface for TypeScript LSP typing and auto completion
// it should not be used outside of this file
interface TestCase {
  name: string;
  value: Duration | Date | DateTime;
  expectedText: string;
  expectedTooltip: string;
  expectedDateTimeAttribute: string;
}

function test(
  name: string,
  value: Duration | Date | DateTime,
  expectedText: string,
  expectedTooltip: string,
  expectedDateTimeAttribute: string
): TestCase {
  return {
    name,
    value,
    expectedText,
    expectedTooltip,
    expectedDateTimeAttribute,
  };
}

describe("TimeSince", () => {
  let spec: Spectator<TimeSinceComponent>;
  let updateSpy: jasmine.Spy;

  const createComponent = createComponentFactory({
    component: TimeSinceComponent,
    providers: [provideMockBawApi()],
  });

  const timeElement = () => spec.query<HTMLTimeElement>("time");

  withDefaultZone("Australia/Darwin", () => {
    function setup(defaultValue: DateTime | Duration | Date): void {
      // because the tickValue is a singleton, if we don't set it to undefined
      // the tickValue from the previous test will leak into the next test
      TimeSinceComponent["tickValue"] = undefined;

      jasmine.clock().install();
      jasmine.clock().mockDate(new Date("2020-01-01T00:00:00.000+09:30"));

      spec = createComponent({
        detectChanges: false,
        props: {
          value: defaultValue as any,
        },
      });

      updateSpy = spyOn(spec.component, "update").and.callThrough();

      spec.detectChanges();
    }

    // prettier-ignore
    /* eslint-disable max-len */
    const testCases: TestCase[] = [
      test( "Luxon Duration", Duration.fromObject({ hours: 4, minutes: 42, seconds: 29, milliseconds: 500, }), "4 hours 42 minutes from now", "2020-01-01 04:42:29.500 +09:30 Australia/Darwin", "PT4H42M29.5S"),

      test( "Negative Luxon Duration", Duration.fromObject({ hours: -2, minutes: -10 }), "2 hours 10 minutes ago", "2019-12-31 21:50:00.000 +09:30 Australia/Darwin", "-PT2H10M"), test( "Unbalanced Luxon Duration", Duration.fromObject({ minutes: 300, seconds: 3600 }), "6 hours from now", "2020-01-01 06:00:00.000 +09:30 Australia/Darwin", "PT6H"),

      test("Local Luxon DateTime", DateTime.fromISO("2019-12-31T14:17:58.000"), "9 hours 42 minutes ago", "2019-12-31 14:17:58.000 +09:30 Australia/Darwin", "-PT9H42M2S"),

      // notice how the utc date/time was localized to Australia/Darwin (the test runners timezone)
      test( "UTC Luxon DateTime", DateTime.fromISO("2019-11-13T14:17:58.000Z"), "1 month 3 weeks ago", "2019-11-13 23:47:58.000 +09:30 Australia/Darwin", "-P1M2W6DT12M2S"),

      test( "Future UTC Luxon DateTime", DateTime.fromISO("2020-02-10T14:17:58.000Z"), "1 month 2 weeks from now", "2020-02-10 23:47:58.000 +09:30 Australia/Darwin", "P1M1W5DT23H47M58S"),

      test( "Luxon DateTime with offset", DateTime.fromISO("2019-12-31T04:17:58.123+08:00"), "18 hours 12 minutes ago", "2019-12-31 05:47:58.123 +09:30 Australia/Darwin", "-PT18H12M1.877S"),

      test( "Future Luxon DateTime with offset", DateTime.fromISO("2020-01-02T04:17:58.123+08:00"), "1 day 6 hours from now", "2020-01-02 05:47:58.123 +09:30 Australia/Darwin", "P1DT5H47M58.123S"),

      test( "Luxon DateTime with timezone", DateTime.fromISO("2019-12-31T04:17:58.123+08:00").setZone( "Australia/Perth"), "18 hours 12 minutes ago", "2019-12-31 05:47:58.123 +09:30 Australia/Darwin", "-PT18H12M1.877S"),

      test( "Future Luxon DateTime with offset", DateTime.fromISO("2020-01-02T04:17:58.123+08:00").setZone( "Australia/Perth"), "1 day 6 hours from now", "2020-01-02 05:47:58.123 +09:30 Australia/Darwin", "P1DT5H47M58.123S"),

      test( "JavaScript Date", new Date("2019-11-13T14:17:58.500Z"), "1 month 3 weeks ago", "2019-11-13 23:47:58.500 +09:30 Australia/Darwin", "-P1M2W6DT12M1.5S"),
    ];
    /* eslint-enable max-len */

    afterEach(() => {
      jasmine.clock().uninstall();

      // because the tickValue is a singleton, if we don't set it to undefined
      // the tickValue from the previous test will leak into the next test
      TimeSinceComponent["tickValue"] = undefined;
    });

    it("should create", () => {
      setup(modelData.dateTime());
      expect(spec.component).toBeInstanceOf(TimeSinceComponent);
    });

    it("should update every second if the time since is under 1 minute", () => {
      const secondInMilliseconds = 1000;

      const fakeDuration = Duration.fromObject({ seconds: -30 });
      setup(fakeDuration);

      spec.detectChanges();
      updateSpy.calls.reset();

      expect(timeElement()).toHaveExactTrimmedText("30 seconds ago");

      jasmine.clock().tick(secondInMilliseconds);
      spec.detectChanges();

      expect(updateSpy).toHaveBeenCalledTimes(1);
      expect(timeElement()).toHaveExactTrimmedText("31 seconds ago");
    });

    it("should update every minute if the time since is over 1 minute", () => {
      const secondInMilliseconds = 1000;
      const minuteInMilliseconds = secondInMilliseconds * 60;

      const fakeDuration = Duration.fromObject({ seconds: -59 });
      setup(fakeDuration);

      spec.detectChanges();
      expect(timeElement()).toHaveExactTrimmedText("59 seconds ago");

      updateSpy.calls.reset();
      jasmine.clock().tick(secondInMilliseconds);
      spec.detectChanges();

      // we should observe the update method be called when updating to the 1 minute mark
      expect(updateSpy).toHaveBeenCalledTimes(1);
      expect(timeElement()).toHaveExactTrimmedText("1 minute ago");

      // every second after the one minute mark should not cause an update unless exactly 1 minute has passed
      updateSpy.calls.reset();
      jasmine.clock().tick(secondInMilliseconds);
      spec.detectChanges();

      expect(updateSpy).not.toHaveBeenCalled();
      expect(timeElement()).toHaveExactTrimmedText("1 minute ago");

      // because we have already ticked 1 second, we need to tick 59 more seconds to reach the 2 minute mark
      jasmine.clock().tick(minuteInMilliseconds - secondInMilliseconds);
      spec.detectChanges();

      expect(updateSpy).toHaveBeenCalledTimes(1);
      expect(timeElement()).toHaveExactTrimmedText("2 minutes ago");
    });

    testCases.forEach((testCase) => {
      describe(testCase.name, () => {
        beforeEach(() => {
          setup(testCase.value);
          spec.detectChanges();
        });

        it("should have the correct text", () => {
          expect(timeElement()).toHaveExactTrimmedText(testCase.expectedText);
        });

        it("should have the correct tooltip", () => {
          assertTooltip(timeElement(), testCase.expectedTooltip);
        });

        it("should have the correct dateTime attribute", () => {
          expect(timeElement().dateTime).toBe(
            testCase.expectedDateTimeAttribute
          );
        });
      });
    });
  });
});
