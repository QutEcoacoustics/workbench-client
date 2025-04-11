import {
  Spectator,
  createRoutingFactory,
  mockProvider,
} from "@ngneat/spectator";
import { NgbCollapseModule } from "@ng-bootstrap/ng-bootstrap";
import { CacheModule } from "@services/cache/cache.module";
import { MockConfigModule } from "@services/config/configMock.module";
import { SharedModule } from "@shared/shared.module";
import { ToastService } from "@services/toasts/toasts.service";
import { fakeAsync } from "@angular/core/testing";
import { Project } from "@models/Project";
import { generateProject } from "@test/fakes/Project";
import { TimeComponent } from "@shared/input/time/time.component";
import { BehaviorSubject } from "rxjs";
import { Filters } from "@baw-api/baw-api.service";
import { AudioRecording } from "@models/AudioRecording";
import { DateTimeFilterComponent } from "./date-time-filter.component";

describe("AudioRecordingsFilter", () => {
  let spectator: Spectator<DateTimeFilterComponent>;
  let defaultProject: Project;
  let filterChangeSpy: jasmine.Spy;

  const createComponent = createRoutingFactory({
    component: DateTimeFilterComponent,
    imports: [SharedModule, NgbCollapseModule, MockConfigModule, CacheModule],
    declarations: [TimeComponent],
    providers: [mockProvider(ToastService)],
  });

  function setup(project: Project): void {
    const resolvers = {};
    const models = {};

    resolvers["project"] = "resolver";
    models["project"] = { model: project };

    spectator = createComponent({
      data: { resolvers, ...models },
      detectChanges: false,
    });

    spectator.component.constructedFilters = new BehaviorSubject<
      Filters<AudioRecording>
    >({});
    filterChangeSpy = spyOn(spectator.component.constructedFilters, "next");
    updateForm();
  }

  beforeEach(fakeAsync(() => {
    defaultProject = new Project(generateProject());

    setup(defaultProject);
    updateForm();
  }));

  // helper methods
  function updateForm() {
    spectator.detectChanges();
    // Have to do this tick because of
    // https://github.com/angular/angular/issues/22606#issuecomment-377390233
    // Also because the observable which updates the filter has a debounce timer
    spectator.tick(1000);
    spectator.detectChanges();
  }

  function getElementByInnerText(innerText: string): HTMLElement {
    return spectator.debugElement.query(
      (el) => el.nativeElement.innerText === innerText
    )?.nativeElement as HTMLButtonElement;
  }

  const getDateToggleInput = () =>
    spectator.query<HTMLInputElement>("#date-filtering");
  const getDateInputWrapper = () =>
    spectator.query<HTMLDivElement>("#date-filters-wrapper");
  const getDateStartedAfterInput = () =>
    spectator.query<HTMLInputElement>("#date-started-after");
  const getDateFinishedBeforeInput = () =>
    spectator.query<HTMLInputElement>("#date-finished-before");
  const getTimeOfDayInputWrapper = () =>
    spectator.query<HTMLDivElement>("#time-filters-wrapper");
  const getTimeOfDayToggleInput = () =>
    spectator.query<HTMLInputElement>("#time-filtering");
  const getIgnoreDaylightSavingsInput = () =>
    spectator.query<HTMLInputElement>("#ignore-daylight-savings");
  const getTimeOfDayStartedAfterInput = () =>
    spectator.query<HTMLInputElement>("#time-started-after input");
  const getTimeOfDayFinishedBeforeInput = () =>
    spectator.query<HTMLInputElement>("#time-finished-before input");

  function typeInElement(element: HTMLInputElement, value: string): void {
    spectator.typeInElement(value, element);
    spectator.dispatchTouchEvent(element, "blur");
    updateForm();
  }

  function toggleTimeOfDayFilters(): void {
    const input = getTimeOfDayToggleInput();
    input.click();
    input.dispatchEvent(new Event("input"));

    updateForm();
  }

  function toggleDateFilters(): void {
    const input = getDateToggleInput();
    input.click();
    input.dispatchEvent(new Event("input"));

    updateForm();
  }

  function toggleIgnoreDaylightSavings(): void {
    const input = getIgnoreDaylightSavingsInput();
    input.click();
    input.dispatchEvent(new Event("input"));

    updateForm();
  }

  /** predicates if the element is both collapsable and collapsed */
  function isDivCollapsed(element: HTMLDivElement): boolean {
    const isCollapsable: boolean = element.classList.contains("collapse");
    const isCollapsed: boolean = !element.classList.contains("show");

    return isCollapsable && isCollapsed;
  }

  // start of assertion
  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(DateTimeFilterComponent);
  });

  describe("date filter input", () => {
    it("should initially hide date filter input", fakeAsync(() => {
      expect(getDateToggleInput()).toExist();
      expect(isDivCollapsed(getDateInputWrapper())).toBeTrue();
    }));

    it("should show date filter input when the date filter checkbox is set", fakeAsync(() => {
      toggleDateFilters();
      expect(getDateToggleInput()).toBeTruthy();
      expect(isDivCollapsed(getDateInputWrapper())).toBeFalse();
    }));

    it("should hide date filter input when the date filter checkbox is clicked twice", fakeAsync(() => {
      toggleDateFilters();
      toggleDateFilters();
      expect(getDateToggleInput()).toExist();
      expect(isDivCollapsed(getDateInputWrapper())).toBeTrue();
    }));
  });

  describe("time filter input", () => {
    it("should initially hide time of day filters", fakeAsync(() => {
      expect(getTimeOfDayToggleInput()).toExist();
      expect(isDivCollapsed(getTimeOfDayInputWrapper())).toBeTrue();
    }));

    it("should show time of day filter input when the time of day filter checkbox is set", fakeAsync(() => {
      toggleTimeOfDayFilters();
      expect(getTimeOfDayToggleInput()).toExist();
      expect(isDivCollapsed(getTimeOfDayInputWrapper())).toBeFalse();
    }));

    it("should hide timeOfDay filter input when the time of day filter checkbox is clicked twice", fakeAsync(() => {
      toggleTimeOfDayFilters();
      toggleTimeOfDayFilters();
      expect(getTimeOfDayToggleInput()).toExist();
      expect(isDivCollapsed(getTimeOfDayInputWrapper())).toBeTrue();
    }));

    it("should initially have day light savings time enabled", fakeAsync(() => {
      toggleTimeOfDayFilters();
      expect(getIgnoreDaylightSavingsInput().checked).toBeTrue();
    }));
  });

  describe("date format validation", () => {
    const invalidDateErrorMessage =
      "The date should follow the format yyyy-mm-dd, e.g. 2022-12-01";

    beforeEach(fakeAsync(() => toggleDateFilters()));

    it("should not show an invalid date error if the user has not input a date", fakeAsync(() => {
      updateForm();
      expect(getElementByInnerText(invalidDateErrorMessage)).not.toExist();
    }));

    it("should display an error if the user inputs an invalid date into the start date input", fakeAsync(() => {
      const invalidDate = "-1999-13-02";
      typeInElement(getDateStartedAfterInput(), invalidDate);
      expect(getElementByInnerText(invalidDateErrorMessage)).toExist();
    }));

    it("should not display an error if the user inputs a valid date into the start date input", fakeAsync(() => {
      const validDate = "2020-12-31";
      typeInElement(getDateStartedAfterInput(), validDate);
      expect(getElementByInnerText(invalidDateErrorMessage)).not.toExist();
    }));

    it("should display an error if the user types in an invalid date into the end date input", fakeAsync(() => {
      // in this test, the user mixed their month and day, where the month (21) is greater than 12
      const invalidDate = "2020-21-12";
      typeInElement(getDateFinishedBeforeInput(), invalidDate);
      expect(getElementByInnerText(invalidDateErrorMessage)).toExist();
    }));

    it("should not display an error if the user inputs a valid date into the end date input", fakeAsync(() => {
      const validDate = "2020-12-31";
      typeInElement(getDateFinishedBeforeInput(), validDate);
      expect(getElementByInnerText(invalidDateErrorMessage)).not.toExist();
    }));
  });

  describe("date bounds validation", () => {
    const outOfBoundsDateErrorMessage =
      "The filter dates are outside the date boundary. Ensure that the start date occurs before the end date.";

    beforeEach(fakeAsync(() => toggleDateFilters()));

    it("should show an error if the user inputs an out of bounds date filter", fakeAsync(() => {
      const startDate = "2020-10-10";
      const endDate = "2019-12-10";

      typeInElement(getDateStartedAfterInput(), startDate);
      typeInElement(getDateFinishedBeforeInput(), endDate);

      expect(getElementByInnerText(outOfBoundsDateErrorMessage)).toExist();
    }));

    it("should not show an error if the user inputs a valid date range", fakeAsync(() => {
      const startDate = "2019-12-10";
      const endDate = "2020-10-10";

      typeInElement(getDateStartedAfterInput(), startDate);
      typeInElement(getDateFinishedBeforeInput(), endDate);

      expect(getElementByInnerText(outOfBoundsDateErrorMessage)).not.toExist();
    }));

    it("should not show an out of bounds date error if the user has only input a start date", fakeAsync(() => {
      const startDate = "2021-10-12";
      typeInElement(getDateStartedAfterInput(), startDate);
      expect(getElementByInnerText(outOfBoundsDateErrorMessage)).not.toExist();
    }));

    it("should not show an out of bounds date error if the user has only input an end date", fakeAsync(() => {
      const endDate = "2021-09-01";
      typeInElement(getDateFinishedBeforeInput(), endDate);
      expect(getElementByInnerText(outOfBoundsDateErrorMessage)).not.toExist();
    }));

    it("should not show an out of bounds date error if the user has not input any dates", fakeAsync(() => {
      updateForm();
      expect(getElementByInnerText(outOfBoundsDateErrorMessage)).not.toExist();
    }));

    it("should not show an error if both the start and end dates are the same", fakeAsync(() => {
      const startDate = "2020-10-10";
      const endDate = "2020-10-10";

      typeInElement(getDateStartedAfterInput(), startDate);
      typeInElement(getDateFinishedBeforeInput(), endDate);

      expect(getElementByInnerText(outOfBoundsDateErrorMessage)).not.toExist();
    }));
  });

  describe("time bound validations", () => {
    it("should allow a user to input a start time less than the end time without displaying an error", fakeAsync(() => {
      const startTime = "01:00";
      const endTime = "11:34";
      const invalidInputClass = "is-invalid";

      typeInElement(getTimeOfDayStartedAfterInput(), startTime);
      typeInElement(getTimeOfDayFinishedBeforeInput(), endTime);

      // is-invalid is a bootstrap validation class that will be added to an invalid time input (added by time.component.ts)
      expect(getTimeOfDayStartedAfterInput()).not.toHaveClass(
        invalidInputClass
      );
      expect(getTimeOfDayFinishedBeforeInput()).not.toHaveClass(
        invalidInputClass
      );
    }));

    it("should allow a user to input an end time less than the start time without displaying an error", fakeAsync(() => {
      const startTime = "11:34";
      const endTime = "01:56";
      const invalidInputClass = "is-invalid";

      typeInElement(getTimeOfDayStartedAfterInput(), startTime);
      typeInElement(getTimeOfDayFinishedBeforeInput(), endTime);

      expect(getTimeOfDayStartedAfterInput()).not.toHaveClass(
        invalidInputClass
      );
      expect(getTimeOfDayFinishedBeforeInput()).not.toHaveClass(
        invalidInputClass
      );
    }));
  });

  describe("filters events", () => {
    function assertLastFilterUpdate(
      expectedFilter: Filters<AudioRecording>
    ): void {
      const mostRecentFilterUpdate = filterChangeSpy.calls.mostRecent().args[0];

      const expectedFilterSerialized = JSON.stringify(expectedFilter);
      const mostRecentFilterUpdateSerialized = JSON.stringify(
        mostRecentFilterUpdate
      );

      expect(mostRecentFilterUpdateSerialized).toEqual(
        expectedFilterSerialized
      );
    }

    // date events where a filter update should not be emitted
    it("should only emit one filter update event if the user hasn't input anything into the filter condition fields", fakeAsync(() => {
      toggleDateFilters();
      toggleTimeOfDayFilters();
      // there is a filter update event emitted when the component is initialized
      // this is done for the batch downloading component which needs the initial filter state for its batch downloading script
      // therefore, if the user has not input any filters, there should only be the initial filter update
      expect(filterChangeSpy).toHaveBeenCalledTimes(1);
    }));

    it("should not emit a filter update if the start date is a bad format", fakeAsync(() => {
      // in this assertion, the user has typed a string into the date input. This will pass *some* assertions
      // if this test is failing, the raw input from the input field is being passed to the date filter without its type being validated
      const malformedStartDate = "testing";

      expect(filterChangeSpy).toHaveBeenCalledTimes(1);

      toggleDateFilters();
      typeInElement(getDateStartedAfterInput(), malformedStartDate);
      expect(filterChangeSpy).toHaveBeenCalledTimes(1);
    }));

    it("should not emit a filter update if the end date is a bad format", fakeAsync(() => {
      // in this test, the day (12) and month (20) are swapped. It should not reformat the date or emit a filter update event in this case
      const malformedEndDate = "2021-20-12";

      expect(filterChangeSpy).toHaveBeenCalledTimes(1);
      toggleDateFilters();
      typeInElement(getDateStartedAfterInput(), malformedEndDate);
      expect(filterChangeSpy).toHaveBeenCalledTimes(1);
    }));

    it("should not emit a filter update if the dates are out of bounds", fakeAsync(() => {
      const startDate = "2022-10-10";
      const endDate = "2021-09-02";

      toggleDateFilters();
      typeInElement(getDateStartedAfterInput(), startDate);
      typeInElement(getDateFinishedBeforeInput(), endDate);

      // a filter change event would have been emitted once due to the correctly formatted and valid start date
      // we therefore have to assert that two filter events didn't get emitted from the second date input (which is out of bounds)
      expect(filterChangeSpy).toHaveBeenCalledTimes(2);
    }));

    // date filter update events
    it("should construct the correct filter if the start date is set", fakeAsync(() => {
      const startDate = "2018-01-12";

      const expectedFilters = {
        filter: {
          recordedEndDate: { greaterThan: "2018-01-12T00:00:00.000Z" },
        },
      } as Filters<AudioRecording>;

      toggleDateFilters();
      typeInElement(getDateStartedAfterInput(), startDate);

      assertLastFilterUpdate(expectedFilters);
    }));

    it("should construct the correct filter if only the end date is set", fakeAsync(() => {
      const endDate = "2020-07-11";
      const expectedFilters = {
        filter: {
          recordedDate: { lessThan: `${endDate}T00:00:00.000Z` },
        },
      };

      toggleDateFilters();
      typeInElement(getDateFinishedBeforeInput(), endDate);

      assertLastFilterUpdate(expectedFilters);
    }));

    it("should construct the correct filter if the start and end date is set", fakeAsync(() => {
      // this test uses the same start and end date for the assertion
      // if this test if failing, it might be because the component cannot accept the same start and end date
      const startDate = "2021-01-01";
      const endDate = "2021-01-01";
      const expectedFilters: Filters<AudioRecording> = {
        filter: {
          and: [
            {
              recordedEndDate: { greaterThan: "2021-01-01T00:00:00.000Z" },
            },
            {
              recordedDate: { lessThan: "2021-01-01T00:00:00.000Z" },
            },
          ],
        },
      };

      toggleDateFilters();
      typeInElement(getDateStartedAfterInput(), startDate);
      typeInElement(getDateFinishedBeforeInput(), endDate);

      assertLastFilterUpdate(expectedFilters);
    }));

    // if the user inputs a date filter, then removes the date filter there should be no filter conditions
    it("should emit an empty filter if a date condition is set, then unset", fakeAsync(() => {
      const startDate = "2021-03-15";
      const endDate = "2022-03-18";

      toggleDateFilters();
      typeInElement(getDateStartedAfterInput(), startDate);
      typeInElement(getDateFinishedBeforeInput(), endDate);

      toggleDateFilters();

      assertLastFilterUpdate({});
    }));

    // time events where a filter update should not be emitted
    it("should not emit a filter update if the start time is a bad format", fakeAsync(() => {
      const startTime = "25:00";

      expect(filterChangeSpy).toHaveBeenCalledTimes(1);
      toggleTimeOfDayFilters();
      typeInElement(getTimeOfDayStartedAfterInput(), startTime);

      expect(filterChangeSpy).toHaveBeenCalledTimes(1);
    }));

    it("should not emit a filter update if the end time is a bad format", fakeAsync(() => {
      const endTime = "01:98";

      expect(filterChangeSpy).toHaveBeenCalledTimes(1);

      toggleTimeOfDayFilters();
      typeInElement(getTimeOfDayFinishedBeforeInput(), endTime);

      expect(filterChangeSpy).toHaveBeenCalledTimes(1);
    }));

    it("should emit an empty filter update if the time condition is set, then unset", fakeAsync(() => {
      const startTime = "12:12";
      const endTime = "12:12";

      toggleTimeOfDayFilters();
      typeInElement(getTimeOfDayStartedAfterInput(), startTime);
      typeInElement(getTimeOfDayFinishedBeforeInput(), endTime);

      toggleTimeOfDayFilters();

      assertLastFilterUpdate({});
    }));

    it("should not emit time filters if the time bounds are set, but the 'Filter by time of day' checkbox is not checked", fakeAsync(() => {
      const startTime = "12:12";
      const startDate = "2015-12-15";

      // the date input is still shown, and therefore, only the date filters should still be emitted in the filter update, but not time
      const expectedFilters = {
        filter: {
          recordedEndDate: { greaterThan: `${startDate}T00:00:00.000Z` },
        },
      } as Filters<AudioRecording>;

      toggleTimeOfDayFilters();
      typeInElement(getTimeOfDayStartedAfterInput(), startTime);
      toggleDateFilters();
      typeInElement(getDateStartedAfterInput(), startDate);

      // the time of day filters are now hidden and should not be emitted in the filter update
      toggleTimeOfDayFilters();

      assertLastFilterUpdate(expectedFilters);
    }));

    it("should not emit date filters if the date bounds are set, but the 'Filter by date' checkbox is not checked", fakeAsync(() => {
      const startTime = "12:12";
      const startDate = "2015-12-15";

      const expectedFilters = {
        filter: {
          recordedEndDate: {
            greaterThan: {
              expressions: ["local_offset", "time_of_day"],
              value: "12:12",
            },
          },
        },
      } as Filters<AudioRecording>;

      toggleDateFilters();
      typeInElement(getDateStartedAfterInput(), startDate);
      toggleTimeOfDayFilters();
      typeInElement(getTimeOfDayStartedAfterInput(), startTime);

      // the date filters are now hidden and should not be emitted in the filter update
      toggleDateFilters();

      assertLastFilterUpdate(expectedFilters);
    }));

    // time filters depend on daylight savings, therefore, it is required that all time assertions are tested against dst settings
    [false, true].forEach((ignoreDayLightSavings: boolean) => {
      const expectedOffsetExpression = ignoreDayLightSavings
        ? "local_tz"
        : "local_offset";
      const expressions = [expectedOffsetExpression, "time_of_day"];

      it(`can filter recordings past a day boundary with a composition of filters, 10PM to 1 AM with ignore day light savings ${
        ignoreDayLightSavings ? "set" : "unset"
      }`, fakeAsync(() => {
        const startTime = "22:00";
        const endTime = "01:00";
        const startDate = "2021-10-03";
        const endDate = "2021-10-04";

        const expectedFilter: Filters<AudioRecording> = {
          filter: {
            and: [
              {
                recordedEndDate: {
                  greaterThan: `${startDate}T00:00:00.000Z`,
                },
              },
              {
                recordedDate: { lessThan: `${endDate}T00:00:00.000Z` },
              },
              {
                or: [
                  {
                    recordedEndDate: {
                      greaterThanOrEqual: { expressions, value: startTime },
                    },
                  },
                  {
                    recordedDate: {
                      lessThanOrEqual: { expressions, value: endTime },
                    },
                  },
                  {
                    recordedEndDate: {
                      lessThanOrEqual: { expressions, value: endTime },
                    },
                  },
                ],
              },
            ],
          },
        };

        toggleTimeOfDayFilters();
        if (ignoreDayLightSavings) {
          toggleIgnoreDaylightSavings();
          updateForm();
        }

        typeInElement(getTimeOfDayStartedAfterInput(), startTime);
        typeInElement(getTimeOfDayFinishedBeforeInput(), endTime);
        toggleDateFilters();
        typeInElement(getDateStartedAfterInput(), startDate);
        typeInElement(getDateFinishedBeforeInput(), endDate);

        assertLastFilterUpdate(expectedFilter);
      }));

      it(`should include the start time in the filter with ignore day light savings ${
        ignoreDayLightSavings ? "set" : "unset"
      }`, fakeAsync(() => {
        const startTime = "11:11";

        // since this filter only has one condition, it should not be contained within an and: [] filter condition array
        const expectedFilters = {
          filter: {
            recordedEndDate: {
              greaterThan: {
                expressions: [expectedOffsetExpression, "time_of_day"],
                value: "11:11",
              },
            },
          },
        } as Filters<AudioRecording>;

        toggleTimeOfDayFilters();
        if (ignoreDayLightSavings) {
          toggleIgnoreDaylightSavings();
          updateForm();
        }

        typeInElement(getTimeOfDayStartedAfterInput(), startTime);

        assertLastFilterUpdate(expectedFilters);
      }));

      it(`should include the end time in the filter with ignore day light savings time ${
        ignoreDayLightSavings ? "set" : "unset"
      }`, fakeAsync(() => {
        const endTime = "03:21";
        const expectedFilters = {
          filter: {
            recordedDate: {
              lessThan: {
                expressions,
                value: "03:21",
              },
            },
          },
        };

        toggleTimeOfDayFilters();
        if (ignoreDayLightSavings) {
          toggleIgnoreDaylightSavings();
          updateForm();
        }

        typeInElement(getTimeOfDayFinishedBeforeInput(), endTime);

        assertLastFilterUpdate(expectedFilters);
      }));

      it(`should include start and end time in the filter with ignore day light savings time ${
        ignoreDayLightSavings ? "set" : "unset"
      }`, fakeAsync(() => {
        const startTime = "12:11";
        const endTime = "15:00";
        const expectedFilters: Filters<AudioRecording> = {
          filter: {
            // since there are multiple conditions to these filters, they should be contained within an and: [] filter condition array
            and: [
              {
                recordedEndDate: {
                  greaterThan: {
                    expressions,
                    value: startTime,
                  },
                },
              },
              {
                recordedDate: {
                  lessThan: {
                    expressions,
                    value: endTime,
                  },
                },
              },
            ],
          },
        };

        toggleTimeOfDayFilters();
        if (ignoreDayLightSavings) {
          toggleIgnoreDaylightSavings();
          updateForm();
        }

        typeInElement(getTimeOfDayStartedAfterInput(), startTime);
        typeInElement(getTimeOfDayFinishedBeforeInput(), endTime);

        assertLastFilterUpdate(expectedFilters);
      }));

      it(`should construct the correct filters for a start date and start time with day light savings ${
        ignoreDayLightSavings ? "set" : "unset"
      }`, fakeAsync(() => {
        const startTime = "13:22";
        const startDate = "2112-11-01";

        const expectedFilters: Filters<AudioRecording> = {
          filter: {
            and: [
              {
                recordedEndDate: {
                  greaterThan: "2112-11-01T00:00:00.000Z",
                },
              },
              {
                recordedEndDate: {
                  greaterThan: {
                    expressions,
                    value: startTime,
                  },
                },
              },
            ],
          },
        };

        toggleTimeOfDayFilters();
        if (ignoreDayLightSavings) {
          toggleIgnoreDaylightSavings();
          updateForm();
        }

        toggleDateFilters();
        typeInElement(getDateStartedAfterInput(), startDate);
        typeInElement(getTimeOfDayStartedAfterInput(), startTime);

        assertLastFilterUpdate(expectedFilters);
      }));

      // this test asserts that time and date filters can be combined into a single value in the and: [] filter condition array
      // e.g. the start date and start times should both be under the and: [ { greaterThan: {} } ] condition
      // if this test is failing, the conditions are most likely not being combined correctly
      it(`should construct the correct filters for date and time range with day light savings ${
        ignoreDayLightSavings ? "set" : "unset"
      }`, fakeAsync(() => {
        const startTime = "08:12";
        const endTime = "12:12";
        const startDate = "1989-11-08";
        const endDate = "2043-12-12";

        const expectedFilters: Filters<AudioRecording> = {
          filter: {
            and: [
              {
                recordedEndDate: {
                  greaterThan: `${startDate}T00:00:00.000Z`,
                },
              },
              {
                recordedDate: {
                  lessThan: `${endDate}T00:00:00.000Z`,
                },
              },
              {
                recordedEndDate: {
                  greaterThan: {
                    expressions,
                    value: startTime,
                  },
                },
              },
              {
                recordedDate: {
                  lessThan: {
                    expressions,
                    value: endTime,
                  },
                },
              },
            ],
          },
        };

        toggleTimeOfDayFilters();
        if (ignoreDayLightSavings) {
          toggleIgnoreDaylightSavings();
          updateForm();
        }

        toggleDateFilters();
        typeInElement(getDateStartedAfterInput(), startDate);
        typeInElement(getDateFinishedBeforeInput(), endDate);
        typeInElement(getTimeOfDayStartedAfterInput(), startTime);
        typeInElement(getTimeOfDayFinishedBeforeInput(), endTime);

        assertLastFilterUpdate(expectedFilters);
      }));

      it("should emit an empty filter if filter conditions are set then removed", fakeAsync(() => {
        const startTime = "08:12";
        const endTime = "12:12";
        const startDate = "1989-11-08";
        const endDate = "2043-12-12";

        const expectedFilters: Filters<AudioRecording> = {};

        toggleTimeOfDayFilters();
        if (ignoreDayLightSavings) {
          toggleIgnoreDaylightSavings();
          updateForm();
        }

        toggleDateFilters();
        typeInElement(getDateStartedAfterInput(), startDate);
        typeInElement(getDateFinishedBeforeInput(), endDate);
        typeInElement(getTimeOfDayStartedAfterInput(), startTime);
        typeInElement(getTimeOfDayFinishedBeforeInput(), endTime);

        // remove the filters
        toggleDateFilters();
        toggleTimeOfDayFilters();

        assertLastFilterUpdate(expectedFilters);
      }));
    });
  });

  describe("disabled inputs", () => {
    it("should disable the start date input if 'disableStartDate' is set", () => {
      spectator.setInput("disableStartDate", true);
      expect(getDateStartedAfterInput()).toBeDisabled();
    });

    it("should disable the end date input if 'disableEndDate' is set", () => {
      spectator.setInput("disableEndDate", true);
      expect(getDateFinishedBeforeInput()).toBeDisabled();
    });

    it("should disable the start time input if 'disableStartTime' is set", () => {
      spectator.setInput("disableStartTime", true);
      expect(getTimeOfDayStartedAfterInput()).toBeDisabled();
    });

    it("should disable the end time input if 'disableEndTime' is set", () => {
      spectator.setInput("disableEndTime", true);
      expect(getTimeOfDayFinishedBeforeInput()).toBeDisabled();
    });

    it("should not show a toggle for date inputs if both start and end dates are disabled", () => {
      spectator.setInput("disableStartDate", true);
      spectator.setInput("disableEndDate", true);

      expect(getDateToggleInput()).not.toExist();
    });

    it("should not show a toggle for time inputs if both start and end times are disabled", () => {
      spectator.setInput("disableStartTime", true);
      spectator.setInput("disableEndTime", true);

      expect(getTimeOfDayToggleInput()).not.toExist();
    });
  });
});
