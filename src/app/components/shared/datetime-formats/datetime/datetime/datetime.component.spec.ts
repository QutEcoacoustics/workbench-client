import { provideMockBawApi } from "@baw-api/provide-bawApiMock";
import { DateTime } from "luxon";
import { assertTooltip } from "@test/helpers/html";
import { withDefaultZone } from "@test/helpers/mocks";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DatetimeComponent } from "./datetime.component";

// I have created this interface for TypeScript LSP typing and auto completion
// it should not be used outside of this file
interface TestCase {
  name: string;
  value: Date | DateTime;
  expectedText: string;
  expectedTooltip: string;
  expectedDateTimeAttribute: string;
  date?: boolean;
  time?: boolean;
}

function test(
  name: string,
  value: Date | DateTime,
  expectedText: string,
  expectedTooltip: string,
  expectedDateTimeAttribute: string,
  date?: boolean,
  time?: boolean
): TestCase {
  return {
    name,
    value,
    expectedText,
    expectedTooltip,
    expectedDateTimeAttribute,
    date,
    time,
  };
}

describe("DatetimeComponent", () => {
  let fixture: ComponentFixture<DatetimeComponent>;
  let component: DatetimeComponent;

  function timeElement(): HTMLTimeElement {
    return fixture.debugElement.query(By.css("time")).nativeElement;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockBawApi()],
    });

    fixture = TestBed.createComponent(DatetimeComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it("should create", () => {
    const fakeDateTime = DateTime.fromISO("2020-01-01T12:10:11.000Z");
    fixture.componentRef.setInput("value", fakeDateTime);
    fixture.detectChanges();

    expect(component).toBeInstanceOf(DatetimeComponent);
  });

  const localTimezone = "Australia/Perth";
  const localTimezoneOffset = "+08:00";

  withDefaultZone(localTimezone, () => {
    // prettier-ignore
    /* eslint-disable max-len */
    const testCases: TestCase[] = [
      test("UTC DateTime", DateTime.fromISO("2020-01-01T12:10:11.123Z"), "2020-01-01 20:10:11", "2020-01-01 20:10:11.123 +08:00 Australia/Perth", "2020-01-01T20:10:11.123+08:00"),

      test("local DateTime", DateTime.fromISO("2020-01-01T12:10:11.321"), "2020-01-01 12:10:11", `2020-01-01 12:10:11.321 ${localTimezoneOffset} ${localTimezone}`, `2020-01-01T12:10:11.321${localTimezoneOffset}`),

      test("DateTime with offset", DateTime.fromISO("2020-01-01T12:10:11.123+02:00"), "2020-01-01 18:10:11", "2020-01-01 18:10:11.123 +08:00 Australia/Perth", "2020-01-01T18:10:11.123+08:00"),

      test("DateTime with timezone", DateTime.fromISO("2020-01-01T12:10:11.123+09:30").setZone("Australia/Darwin"), "2020-01-01 10:40:11", "2020-01-01 10:40:11.123 +08:00 Australia/Perth", "2020-01-01T10:40:11.123+08:00"),

      test("DateTime with a negative offset", DateTime.fromISO("2020-01-01T12:10:11.123-01:00"), "2020-01-01 21:10:11", "2020-01-01 21:10:11.123 +08:00 Australia/Perth", "2020-01-01T21:10:11.123+08:00"),

      test("DateTime with a western timezone", DateTime.fromISO("2020-01-01T12:10:11.123-08:00").setZone("America/Los_Angeles"), "2020-01-02 04:10:11", "2020-01-02 04:10:11.123 +08:00 Australia/Perth", "2020-01-02T04:10:11.123+08:00"),

      test("DateTime with attribute date", DateTime.fromISO("2020-01-01T12:10:11.123Z"), "2020-01-01", "2020-01-01 20:10:11.123 +08:00 Australia/Perth", "2020-01-01T20:10:11.123+08:00", true),

      test("DateTime with attribute time", DateTime.fromISO("2020-01-01T12:10:11.123Z"), "20:10:11", "2020-01-01 20:10:11.123 +08:00 Australia/Perth", "2020-01-01T20:10:11.123+08:00", false, true),

      test("DateTime with attributes date and time", DateTime.fromISO("2020-01-01T12:10:11.123Z"), "2020-01-01 20:10:11", "2020-01-01 20:10:11.123 +08:00 Australia/Perth", "2020-01-01T20:10:11.123+08:00", true, true),

      test("UTC Date", new Date("2020-01-01T12:10:11.123Z"), "2020-01-01 20:10:11", "2020-01-01 20:10:11.123 +08:00 Australia/Perth", "2020-01-01T20:10:11.123+08:00"),

      test("Local Date", new Date(`2020-01-01T12:10:11.123${localTimezoneOffset}`), "2020-01-01 12:10:11", `2020-01-01 12:10:11.123 ${localTimezoneOffset} ${localTimezone}`, `2020-01-01T12:10:11.123${localTimezoneOffset}`),

      test("UTC Date with an offset", new Date("2020-01-01T12:10:11.123+01:00"), "2020-01-01 19:10:11", "2020-01-01 19:10:11.123 +08:00 Australia/Perth", "2020-01-01T19:10:11.123+08:00"),

      test("UTC Date with a negative offset", new Date("2020-01-01T12:10:11.123-01:00"), "2020-01-01 21:10:11", "2020-01-01 21:10:11.123 +08:00 Australia/Perth", "2020-01-01T21:10:11.123+08:00"),
    ];
    /* eslint-enable max-len */

    testCases.forEach((testCase) => {
      describe(`with ${testCase.name}`, () => {
        beforeEach(() => {
          fixture.componentRef.setInput("value", testCase.value);
          fixture.componentRef.setInput("date", testCase.date);
          fixture.componentRef.setInput("time", testCase.time);

          fixture.detectChanges();
        });

        // by using withDefaultZone we are able to mock the test runners timezone and correctly reset the test runners timezone
        // so that it doesn't impact any other tests
        it("should have the correct text", () => {
          expect(timeElement().textContent.trim()).toBe(testCase.expectedText);
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
