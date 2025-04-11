import { SharedModule } from "@shared/shared.module";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { DateTime, FixedOffsetZone, IANAZone } from "luxon";
import { modelData } from "@test/helpers/faker";
import { assertTooltip } from "@test/helpers/html";
import { TimezoneInformation } from "@interfaces/apiInterfaces";
import { withDefaultZone } from "@test/helpers/mocks";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { ZonedDateTimeComponent } from "./zoned-datetime.component";

// I have created this interface for TypeScript LSP typing and auto completion
// it should not be used outside of this file
interface TestCase {
  name: string;
  value: DateTime | Date;
  text: string;
  tooltipText: string;
  dateTimeAttribute: string;
  date?: boolean;
  time?: boolean;
  explicitTimezone?: string;
}

interface TestTimezone {
  name: string;
  value: IANAZone | FixedOffsetZone | TimezoneInformation | string | null;
}

function test(
  name: string,
  value: DateTime | Date,
  text: string,
  tooltipText: string,
  dateTimeAttribute: string,
  date?: boolean,
  time?: boolean,
  explicitTimezone?: string
): TestCase {
  return {
    name,
    value,
    text,
    tooltipText,
    dateTimeAttribute,
    date,
    time,
    explicitTimezone,
  };
}

describe("ZonedDateTimeComponent", () => {
  let component: ZonedDateTimeComponent;
  let fixture: ComponentFixture<ZonedDateTimeComponent>;

  function timeElement(): HTMLTimeElement {
    return fixture.debugElement.query(By.css("time")).nativeElement;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, MockBawApiModule],
    });

    fixture = TestBed.createComponent(ZonedDateTimeComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it("should create", () => {
    fixture.componentRef.setInput("value", modelData.dateTime());
    fixture.detectChanges();
    expect(component).toBeInstanceOf(ZonedDateTimeComponent);
  });

  const localTimezone = "Australia/Darwin";
  const localTimezoneOffset = "+09:30";

  withDefaultZone(localTimezone, () => {
    // prettier-ignore
    /* eslint-disable max-len */
    const testCases: TestCase[] = [
      test("Local DateTime", DateTime.fromISO("2020-01-01T12:10:11.123"), "2020-01-01 12:10:11", `2020-01-01 12:10:11.123 ${localTimezoneOffset} ${localTimezone}`, `2020-01-01T12:10:11.123${localTimezoneOffset}`),

      // implicit timezone
      test("DateTime", DateTime.fromISO("2020-01-01T12:10:11.123+08:00").setZone("Australia/Perth"), "2020-01-01 12:10:11", "2020-01-01 12:10:11.123 +08:00 Australia/Perth", "2020-01-01T12:10:11.123+08:00", false, false),

      test("Western timezone DateTime", DateTime.fromISO("2020-01-01T12:10:11.123-08:00").setZone("America/Los_Angeles"), "2020-01-01 12:10:11", "2020-01-01 12:10:11.123 -08:00 America/Los_Angeles", "2020-01-01T12:10:11.123-08:00", false, false),

      test("DateTime with date attribute", DateTime.fromISO("2020-01-01T23:10:11.123"), "2020-01-01", "2020-01-01 23:10:11.123 +09:30 Australia/Darwin", "2020-01-01T23:10:11.123+09:30", true),

      test("DateTime with time attribute", DateTime.fromISO("2020-01-01T23:10:11.123"), "23:10:11", "2020-01-01 23:10:11.123 +09:30 Australia/Darwin", "2020-01-01T23:10:11.123+09:30", false, true),

      // explicit offset
      test("DateTime with offset", DateTime.fromISO("2020-01-01T12:10:11.123+09:30"), "2020-01-01 03:40:11", "2020-01-01 03:40:11.123 +01:00", "2020-01-01T03:40:11.123+01:00", false, false, "+01:00"),

      test("DateTime with negative offset", DateTime.fromISO("2020-01-01T12:10:11.123+09:30"), "2019-12-31 18:40:11", "2019-12-31 18:40:11.123 -08:00", "2019-12-31T18:40:11.123-08:00", false, false, "-08:00"),

      test("DateTime with offset and date attribute", DateTime.fromISO("2020-01-01T12:10:11.123+09:30"), "2020-01-01", "2020-01-01 10:40:11.123 +08:00", "2020-01-01T10:40:11.123+08:00", true, false, "+08:00"),

      test("DateTime with offset and time attribute", DateTime.fromISO("2020-01-01T12:10:11.123+09:30"), "10:40:11", "2020-01-01 10:40:11.123 +08:00", "2020-01-01T10:40:11.123+08:00", false, true, "+08:00"),

      // explicit timezone
      test("DateTime with timezone", DateTime.fromISO("2020-01-01T12:10:11.123+09:30"), "2020-01-01 10:40:11", "2020-01-01 10:40:11.123 +08:00 Australia/Perth", "2020-01-01T10:40:11.123+08:00", false, false, "Australia/Perth"),

      test("DateTime with western timezone", DateTime.fromISO("2020-01-01T12:10:11.123+09:30"), "2019-12-31 18:40:11", "2019-12-31 18:40:11.123 -08:00 America/Los_Angeles", "2019-12-31T18:40:11.123-08:00", false, false, "America/Los_Angeles"),

      test("DateTime with timezone and date attribute", DateTime.fromISO("2020-01-01T12:10:11.123+09:30"), "2020-01-01", "2020-01-01 10:40:11.123 +08:00 Australia/Perth", "2020-01-01T10:40:11.123+08:00", true, false, "Australia/Perth"),

      test("DateTime with timezone and time attribute", DateTime.fromISO("2020-01-01T12:10:11.123+09:30"), "10:40:11", "2020-01-01 10:40:11.123 +08:00 Australia/Perth", "2020-01-01T10:40:11.123+08:00", false, true, "Australia/Perth"),

      // implicit JavaScript Date objects
      // JavaScript automatically converts any parsed date to a date represented in the local timezone
      // so all implicit timezones/offsets for Dates are in local time
      test("Local Date", new Date(`2020-01-01T12:10:11.123${localTimezoneOffset}`), "2020-01-01 12:10:11", `2020-01-01 12:10:11.123 ${localTimezoneOffset} ${localTimezone}`, `2020-01-01T12:10:11.123${localTimezoneOffset}`),

      test("Date", new Date("2020-01-01T12:10:11.123Z"), "2020-01-01 21:40:11", "2020-01-01 21:40:11.123 +09:30 Australia/Darwin", "2020-01-01T21:40:11.123+09:30"),

      test("Date with date attribute", new Date("2020-01-01T12:10:11.123Z"), "2020-01-01", "2020-01-01 21:40:11.123 +09:30 Australia/Darwin", "2020-01-01T21:40:11.123+09:30", true),

      test("Date with time attribute", new Date("2020-01-01T12:10:11.123Z"), "21:40:11", "2020-01-01 21:40:11.123 +09:30 Australia/Darwin", "2020-01-01T21:40:11.123+09:30", false, true),

      // explicit offset & JavaScript Dates
      test("Date with offset", new Date("2020-01-01T12:10:11.123Z"), "2020-01-01 20:10:11", "2020-01-01 20:10:11.123 +08:00", "2020-01-01T20:10:11.123+08:00", false, false, "+08:00"),

      test("Date with negative offset", new Date("2020-01-01T12:10:11.123Z"), "2020-01-01 04:10:11", "2020-01-01 04:10:11.123 -08:00", "2020-01-01T04:10:11.123-08:00", false, false, "-08:00"),

      test("Date with date attribute and offset", new Date("2020-01-01T12:10:11.123Z"), "2020-01-01", "2020-01-01 20:10:11.123 +08:00", "2020-01-01T20:10:11.123+08:00", true, false, "+08:00"),

      test("Date with time attribute and offset", new Date("2020-01-01T12:10:11.123Z"), "20:10:11", "2020-01-01 20:10:11.123 +08:00", "2020-01-01T20:10:11.123+08:00", false, true, "+08:00"),

      // explicit timezone & JavaScript Dates
      test("Date with timezone", new Date("2020-01-01T12:10:11.123Z"), "2020-01-01 20:10:11", "2020-01-01 20:10:11.123 +08:00 Australia/Perth", "2020-01-01T20:10:11.123+08:00", false, false, "Australia/Perth"),

      test("Date with western timezone", new Date("2020-01-01T12:10:11.123Z"), "2020-01-01 04:10:11", "2020-01-01 04:10:11.123 -08:00 America/Los_Angeles", "2020-01-01T04:10:11.123-08:00", false, false, "America/Los_Angeles"),

      test("Date with date attribute and timezone", new Date("2020-01-01T12:10:11.123Z"), "2020-01-01", "2020-01-01 20:10:11.123 +08:00 Australia/Perth", "2020-01-01T20:10:11.123+08:00", true, false, "Australia/Perth"),

      test("Date with time attribute and timezone", new Date("2020-01-01T12:10:11.123Z"), "20:10:11", "2020-01-01 20:10:11.123 +08:00 Australia/Perth", "2020-01-01T20:10:11.123+08:00", false, true, "Australia/Perth"),
    ];
    /* eslint-enable max-len */

    it("should update correctly when updating from explicit to implicit timezone", () => {
      const mockDateTime = DateTime.fromISO("2020-01-01T12:10:11.123+09:30");

      fixture.componentRef.setInput("value", mockDateTime);
      fixture.componentRef.setInput("timezone", "Australia/Perth");
      fixture.detectChanges();

      expect(timeElement().textContent.trim()).toBe("2020-01-01 10:40:11");
      fixture.componentRef.setInput("timezone", null);
      fixture.detectChanges();

      expect(timeElement().textContent.trim()).toBe("2020-01-01 12:10:11");
    });

    it("should update correctly when updating from an implicit to explicit timezone", () => {
      // because we have not set an explicit timezone, the component should default to using the implicit timezone
      const mockDateTime = DateTime.fromISO("2020-01-01T12:10:11.123+09:30");

      fixture.componentRef.setInput("value", mockDateTime);
      fixture.detectChanges();

      expect(timeElement().textContent.trim()).toBe("2020-01-01 12:10:11");

      fixture.componentRef.setInput("timezone", "Australia/Perth");
      fixture.detectChanges();

      expect(timeElement().textContent.trim()).toBe("2020-01-01 10:40:11");
    });

    for (const testCase of testCases) {
      // our component accepts time zones in different formats and we want to test each automatically
      // so generate extra cases for IANA time zone strings, luxon time zone objects,
      // and our standard API time zone info objects
      const componentTimezones = (): TestTimezone[] => {
        if (isInstantiated(testCase.explicitTimezone)) {
          const stringTimezone: TestTimezone = {
            name: "string timezone",
            value: testCase.explicitTimezone,
          };

          const bawTimezoneInformation: TestTimezone = {
            name: "baw timezone information",
            value: {
              identifier: testCase.explicitTimezone,
            } as TimezoneInformation,
          };

          const ianaZone = IANAZone.create(testCase.explicitTimezone);
          let luxonZone = ianaZone;

          // if the timezone is not a valid IANA zone, we want to test, we assume that it is a fixed offset
          // eg. Europe/Paris is a valid IANA zone, but +01:00 is not because it is a fixed offset
          // because our component can accept both a IANAZone and a FixedOffsetZone, we want to test both
          // depending on the shape of the descriptor
          if (!ianaZone.isValid) {
            luxonZone = FixedOffsetZone.parseSpecifier(
              `UTC${testCase.explicitTimezone}`
            );
          }

          const luxonTestTimezone: TestTimezone = {
            name: "luxon timezone",
            value: luxonZone,
          };

          return [stringTimezone, luxonTestTimezone, bawTimezoneInformation];
        }

        // if we do not define an explicit timezone, we can use the implicit timezone by setting timezone to null
        return [
          {
            name: "implicit timezone",
            value: null,
          },
        ];
      };

      describe(testCase.name, () => {
        for (const timezone of componentTimezones()) {
          describe(`with timezone type: ${timezone.name}`, () => {
            beforeEach(() => {
              fixture.componentRef.setInput("timezone", timezone.value);
              fixture.componentRef.setInput("value", testCase.value);
              fixture.componentRef.setInput("date", testCase.date);
              fixture.componentRef.setInput("time", testCase.time);

              fixture.detectChanges();
            });

            it("should display the correct text", () => {
              const expectedValue = testCase.text;
              expect(timeElement().textContent.trim()).toBe(expectedValue);
            });

            it("should display the correct tooltip", () => {
              const expectedValue = testCase.tooltipText;
              assertTooltip(timeElement(), expectedValue);
            });

            it("should have the correct dateTime attribute", () => {
              const expectedValue = testCase.dateTimeAttribute;
              expect(timeElement().dateTime).toBe(expectedValue);
            });
          });
        }
      });
    }
  });
});
