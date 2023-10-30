import { fakeAsync } from "@angular/core/testing";
import { Spectator, createComponentFactory, typeInElement } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { Duration } from "luxon";
import { TimeComponent } from "./time.component";

describe("TimeComponent", () => {
  let spectator: Spectator<TimeComponent>;

  const createComponent = createComponentFactory({
    component: TimeComponent,
    imports: [SharedModule],
  });

  function setup(): void {
    spectator = createComponent({ detectChanges: false });
    spectator.detectChanges();
  }

  beforeEach(() => setup());

  const inputElement = (): HTMLInputElement => spectator.query("input");
  const errorsElement = (): HTMLDivElement => spectator.query(".invalid-feedback");

  function typeInTimeValue(value: string): void {
    inputElement().dispatchEvent(new Event("blur"));
    typeInElement(value, inputElement());

    spectator.detectChanges();
  }

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(TimeComponent);
  });

  it("should display an error if a time with an hour greater than 24 is entered", fakeAsync(() => {
    const expectedError = "Hours must be between 00 and 24";

    typeInTimeValue("25:00");

    expect(spectator.component.errors).toEqual([expectedError]);
    expect(errorsElement()).toHaveText(expectedError);
  }));

  it("should display an error if the user inputs a time with a minute greater than 59", () => {
    const expectedError = "Minutes must be between 00 and 59";

    typeInTimeValue("10:61");

    expect(spectator.component.errors).toEqual([expectedError]);
    expect(errorsElement()).toHaveText(expectedError);
  });

  it("should display an error if the user inputs a time with alphabetical characters in it", () => {
    const expectedError = "The time should follow the format hh:mm, e.g. 15:30";

    typeInTimeValue("abc1");

    expect(spectator.component.errors).toEqual([expectedError]);
    expect(errorsElement()).toHaveText(expectedError);
  });

  it("should emit a change event with the new time value when the user inputs a valid time", () => {
    const testTime = "12:34";
    const expectedDuration: Duration = Duration.fromDurationLike({
      hours: 12,
      minutes: 34,
    });

    spectator.component.onChange = jasmine.createSpy("onChange").and.callThrough();

    typeInTimeValue(testTime);

    expect(spectator.component.onChange).toHaveBeenCalledWith(expectedDuration);
  });

  it("should have a value of undefined if the user inputs an invalid time", () => {
    typeInTimeValue("abc1");
    expect(spectator.component.value).toBeUndefined();
  });

  // this test exists because in Angular 15 (and possible future versions)
  // they changed how disabled states work on elements
  // we therefore should create a test for this to prevent regressions
  it("should be disabled if the disabled input is set to true", () => {
    spectator.setInput("disabled", true);
    expect(inputElement().hasAttribute("disabled")).toBeTrue();
  });
});
