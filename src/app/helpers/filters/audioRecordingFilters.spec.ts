import { DateExpressions, InnerFilter } from "@baw-api/baw-api.service";
import { AudioRecording } from "@models/AudioRecording";
import { DateTime, Duration } from "luxon";
import { filterDate, filterTime } from "./audioRecordingFilters";

describe("AudioRecordingFilters", () => {
  const createUTCDate = (year: number, month: number, day: number): DateTime =>
    DateTime.fromObject({ year, month, day }, { zone: "utc" });
  const emptyFilter: InnerFilter<AudioRecording> = {};

  describe("addDateFilters", () => {
    // inner filters created by the filter helper functions do not produce expected filters until JSON.stringify() is applied
    // to make this assertion easier, we can mock an API calling .toJSON() on nested sub objects by stringifying the result
    function assertFilters(observedResult: InnerFilter<unknown>, expectedResult: InnerFilter<AudioRecording>): void {
      const observedResultString = JSON.stringify(observedResult);
      const expectedResultString = JSON.stringify(expectedResult);

      expect(observedResultString).toEqual(expectedResultString);
    }

    it("should create the correct date filter for a single start date", () => {
      const startDate = createUTCDate(2020, 1, 1);
      const expectedFilter = {
        // if there are not multiple filter conditions, the singular condition should not be contained within an and: [] conditional block
        // to ensure correctness, the time should be explicitly emitted with a value of 00:00:00
        recordedEndDate: { greaterThan: "2020-01-01T00:00:00.000Z" },
      } as InnerFilter<AudioRecording>;

      const observedResult = filterDate(emptyFilter, startDate);
      assertFilters(observedResult, expectedFilter);
    });

    it("should create the correct date filter for a single end date", () => {
      const endDate = createUTCDate(2022, 11, 9);
      const expectedFilter: InnerFilter<AudioRecording> = {
        recordedDate: { lessThan: "2022-11-09T00:00:00.000Z" },
      };

      // in real world examples, if the user has not specified a start date into an input box, the start date will be undefined
      // therefore, we can replicate this behavior by explicitly passing undefined as the start date
      const observedResult = filterDate(emptyFilter, undefined, endDate);
      assertFilters(observedResult, expectedFilter);
    });

    it("should create an array condition for a filter with a start and end date", () => {
      const startDate = createUTCDate(2020, 1, 1);
      const endDate = createUTCDate(2022, 11, 9);

      // if there are multiple filter conditions, the conditions should be contained within an and: [] conditional block
      const expectedFilters: InnerFilter<AudioRecording> = {
        and: [
          { recordedEndDate: { greaterThan: "2020-01-01T00:00:00.000Z" } },
          { recordedDate: { lessThan: "2022-11-09T00:00:00.000Z" } },
        ],
      };

      const observedResult = filterDate(emptyFilter, startDate, endDate);
      assertFilters(observedResult, expectedFilters);
    });

    it("should not create a new filter if no date filter conditions are defined", () => {
      const observedResult = filterDate(emptyFilter);
      assertFilters(observedResult, emptyFilter);
    });

    it("should format short dates correctly by padding the start of the year to match the YYYY format", () => {
      const startDate = createUTCDate(20, 1, 1);
      const endDate = createUTCDate(22, 11, 9);
      const expectedFilters: InnerFilter<AudioRecording> = {
        and: [
          { recordedEndDate: { greaterThan: "0020-01-01T00:00:00.000Z" } },
          { recordedDate: { lessThan: "0022-11-09T00:00:00.000Z" } },
        ],
      };

      const observedResult = filterDate(emptyFilter, startDate, endDate);
      assertFilters(observedResult, expectedFilters);
    });
  });

  describe("createTimeFilter", () => {
    [false, true].forEach((ignoringDaylightSavings: boolean) => {
      const expressions: DateExpressions[] = ignoringDaylightSavings
        ? ["local_offset", "time_of_day"]
        : ["local_tz", "time_of_day"];

      it(`should create the correct time filter for a single start time, ${
        ignoringDaylightSavings ? "ignoring" : "using"
      } daylight savings time`, () => {
        // since the what the user inputs and what the time.component.ts emits are different
        // we need to declare two variables for assertion, one for the user input and one for the emitted value
        //! these variables should be logically equivalent
        const startTimeInput = "03:00";
        const startTimeObject: Duration = Duration.fromObject({ hours: 3 });

        const expectedFilter = {
          recordedEndDate: {
            greaterThan: {
              expressions,
              value: startTimeInput,
            },
          },
        } as InnerFilter<AudioRecording>;

        const observedResult = filterTime(emptyFilter, ignoringDaylightSavings, startTimeObject);
        expect(observedResult).toEqual(expectedFilter);
      });

      it(`should create the correct time filter for a single end time, ${
        ignoringDaylightSavings ? "ignoring" : "using"
      } daylight savings time`, () => {
        const endTimeInput = "09:11";
        const endTimeObject: Duration = Duration.fromObject({
          hours: 9,
          minutes: 11,
        });

        const expectedFilter: InnerFilter<AudioRecording> = {
          recordedDate: {
            lessThan: {
              expressions,
              value: endTimeInput,
            },
          },
        };

        const observedResult = filterTime(
          emptyFilter,
          ignoringDaylightSavings,
          // we can put undefined here because in real world scenarios, the start time input will return undefined
          // if there is an invalid input (e.g. no input or incorrectly formatted time)
          undefined,
          endTimeObject,
        );
        expect(observedResult).toEqual(expectedFilter);
      });

      it(`should create an array condition for a filter with multiple times, ${
        ignoringDaylightSavings ? "ignoring" : "using"
      } daylight savings time`, () => {
        const startTimeInput = "03:00";
        const endTimeInput = "05:00";

        const startTimeObject: Duration = Duration.fromObject({ hours: 3 });
        const endTimeObject: Duration = Duration.fromObject({ hours: 5 });

        const expectedFilter: InnerFilter<AudioRecording> = {
          and: [
            {
              recordedEndDate: {
                greaterThan: {
                  expressions,
                  value: startTimeInput,
                },
              },
            },
            {
              recordedDate: {
                lessThan: {
                  expressions,
                  value: endTimeInput,
                },
              },
            },
          ],
        };

        const observedResult = filterTime(emptyFilter, ignoringDaylightSavings, startTimeObject, endTimeObject);
        expect(observedResult).toEqual(expectedFilter);
      });

      it(`should create the correct time filter if the time range goes over midnight, ${
        ignoringDaylightSavings ? "ignoring" : "using"
      } daylight savings time`, () => {
        const startTimeInput = "22:00";
        const endTimeInput = "02:00";
        const startTimeObject = Duration.fromObject({ hours: 22 });
        const endTimeObject = Duration.fromObject({ hours: 2 });

        const initialFilters: InnerFilter<AudioRecording> = {};
        const expectedFilter: InnerFilter<AudioRecording> = {
          or: [
            {
              recordedEndDate: {
                greaterThanOrEqual: {
                  expressions,
                  value: startTimeInput,
                },
              },
            },
            {
              recordedDate: {
                lessThanOrEqual: {
                  expressions,
                  value: endTimeInput,
                },
              },
            },
            {
              recordedEndDate: {
                lessThanOrEqual: {
                  expressions,
                  value: endTimeInput,
                },
              },
            },
          ],
        };

        const observedResult = filterTime(initialFilters, ignoringDaylightSavings, startTimeObject, endTimeObject);
        expect(observedResult).toEqual(expectedFilter);
      });

      it(`should not use the midnight filter if the time range ends at midnight ${
        ignoringDaylightSavings ? "ignoring" : "using"
      } daylight savings time`, () => {
        const startTimeInput = "22:00";
        const endTimeInput = "24:00";
        const startTimeObject: Duration = Duration.fromObject({ hours: 22 });
        const endTimeObject: Duration = Duration.fromObject({ hours: 24 });

        const initialFilters: InnerFilter<AudioRecording> = {};
        const expectedFilter: InnerFilter<AudioRecording> = {
          and: [
            {
              recordedEndDate: {
                greaterThan: {
                  expressions,
                  value: startTimeInput,
                },
              },
            },
            {
              recordedDate: {
                lessThan: {
                  expressions,
                  value: endTimeInput,
                },
              },
            },
          ],
        };

        const observedResult = filterTime(initialFilters, ignoringDaylightSavings, startTimeObject, endTimeObject);
        expect(observedResult).toEqual(expectedFilter);
      });

      it(`should return an empty filter if no start or end times are specified ${
        ignoringDaylightSavings ? "ignoring" : "using"
      } daylight savings time`, () => {
        const initialFilters: InnerFilter<AudioRecording> = {};
        const observedResult = filterTime(initialFilters, ignoringDaylightSavings);
        expect(observedResult).toEqual(initialFilters);
      });
    });
  });
});
