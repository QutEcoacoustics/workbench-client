import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { Duration, DurationLikeObject } from "luxon";
import { modelData } from "@test/helpers/faker";
import { assertTooltip } from "@test/helpers/html";
import { withDefaultZone } from "@test/helpers/mocks";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DurationComponent } from "./duration.component";

// I have created this interface for TypeScript LSP typing and auto completion
// it should not be used outside of this file
interface TestCase {
  name: string;
  value: Duration;
  expectedText: string;
  expectedTooltip: string;
  expectedDateTimeAttribute: string;
  iso8601?: boolean;
  humanized?: boolean;
  sexagesimal?: boolean;
}

function test(
  name: string,
  value: DurationLikeObject,
  expectedText: string,
  expectedTooltip: string,
  expectedDateTimeAttribute: string,
  iso8601?: boolean,
  humanized?: boolean,
  sexagesimal?: boolean
): TestCase {
  return {
    name,
    value: Duration.fromObject(value),
    expectedText,
    expectedTooltip,
    expectedDateTimeAttribute,
    iso8601,
    humanized,
    sexagesimal,
  };
}

// prettier-ignore
/* eslint-disable max-len */
const testCases: TestCase[] = [
  test("sexagesimal", { minutes: 10, seconds: 1.5 }, "00:10:01.500", "00:10:01.500 (PT10M1.5S)", "PT10M1.5S"),

  test("negative sexagesimal", { minutes: -10, seconds: -1.5 }, "-00:10:01.500", "-00:10:01.500 (-PT10M1.5S)", "-PT10M1.5S"),

  test("explicit sexagesimal", { minutes: 10, seconds: 1.5 }, "00:10:01.500", "00:10:01.500 (PT10M1.5S)", "PT10M1.5S", false, false, true),

  test("negative explicit sexagesimal", { minutes: -10, seconds: -1.5 }, "-00:10:01.500", "-00:10:01.500 (-PT10M1.5S)", "-PT10M1.5S", false, false, true),

  test("iso 8601", { minutes: 10, seconds: 1.5 }, "PT10M1.5S", "00:10:01.500 (PT10M1.5S)", "PT10M1.5S", true),

  test("negative iso 8601", { minutes: -10, seconds: -1.5 }, "-PT10M1.5S", "-00:10:01.500 (-PT10M1.5S)", "-PT10M1.5S", true),

  test("human readable", { minutes: 10, seconds: 1.5 }, "10 minutes 2 seconds", "00:10:01.500 (PT10M1.5S)", "PT10M1.5S", false, true),

  test("negative human readable", { minutes: -10, seconds: -1.5 }, "-10 minutes 2 seconds", "-00:10:01.500 (-PT10M1.5S)", "-PT10M1.5S", false, true),

  test("rebalanced sexagesimal duration", { minutes: 300, seconds: 3600 }, "06:00:00.00", "06:00:00.00 (PT6H)", "PT6H"),

  test("rebalanced iso 8601 duration", { minutes: 300, seconds: 3600 }, "PT6H", "06:00:00.00 (PT6H)", "PT6H", true),

  test("rebalanced human readable duration", { minutes: 300, seconds: 3600 }, "6 hours", "06:00:00.00 (PT6H)", "PT6H", false, true),
];
/* eslint-enable max-len */

describe("DurationComponent", () => {
  let fixture: ComponentFixture<DurationComponent>;
  let component: DurationComponent;

  function timeElement(): HTMLTimeElement {
    return fixture.debugElement.query(By.css("time")).nativeElement;
  }

  // because signal inputs are not supported by ngNeat/spectator, I have used the Angular native TestBed
  // so that using setInput() correctly updates the input signal
  // TODO: replace with ngNeat/spectator once https://github.com/ngneat/spectator/issues/637 is resolved
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MockBawApiModule],
    });

    fixture = TestBed.createComponent(DurationComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it("should create", () => {
    fixture.componentRef.setInput("value", modelData.time());
    expect(component).toBeInstanceOf(DurationComponent);
  });

  withDefaultZone("Australia/Perth", () => {
    testCases.forEach((testCase) => {
      describe(testCase.name, () => {
        beforeEach(() => {
          fixture.componentRef.setInput("value", testCase.value);
          fixture.componentRef.setInput("iso8601", testCase.iso8601);
          fixture.componentRef.setInput("humanized", testCase.humanized);
          fixture.componentRef.setInput("sexagesimal", testCase.sexagesimal);
          fixture.detectChanges();
        });

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
