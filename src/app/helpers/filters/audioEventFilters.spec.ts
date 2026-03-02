import { DateExpressions, InnerFilter } from "@baw-api/baw-api.service";

import { AudioEvent } from "@models/AudioEvent";
import { DateTime, Duration } from "luxon";
import { filterEventDate, filterEventTime } from "./audioEventFilters";

describe("AudioEventFilters", () => {
  const createUTCDate = (year: number, month: number, day: number): DateTime =>
    DateTime.fromObject({ year, month, day }, { zone: "utc" });
  const emptyFilter: InnerFilter<AudioEvent> = {};

  describe("addDateFilters", () => {
    it("should do nothing for an empty", () => {
      const result = filterEventDate(emptyFilter, null, null);
      expect(result).toEqual(emptyFilter);
    });

    it("should add a minimum date filter if provided", () => {
      const startDate = createUTCDate(2023, 1, 1);
      const result = filterEventDate(emptyFilter, startDate, null);
      expect(result).toEqual({
        endDate: { gteq: startDate },
      } as any);
    });

    it("should add a maximum date filter if provided", () => {
      const endDate = createUTCDate(2023, 1, 1);
      const result = filterEventDate(emptyFilter, null, endDate);
      expect(result).toEqual({
        startDate: { lt: endDate },
      } as any);
    });

    it("should add both minimum and maximum date filters if both are provided", () => {
      const startDate = createUTCDate(2023, 1, 1);
      const endDate = createUTCDate(2023, 2, 1);
      const result = filterEventDate(emptyFilter, startDate, endDate);
      expect(result).toEqual({
        and: [
          {
            endDate: {
              gteq: startDate,
            },
          },
          {
            startDate: {
              lt: endDate,
            },
          },
        ],
      } as any);
    });
  });

  describe("addTimeFilters", () => {
    [false, true].forEach((ignoringDaylightSavings: boolean) => {
      const expressions: DateExpressions[] = ignoringDaylightSavings
        ? ["local_offset", "time_of_day"]
        : ["local_tz", "time_of_day"];

      it(`should create the correct time filter for a single start time, ${
        ignoringDaylightSavings ? "ignoring" : "using"
      } daylight savings time`, () => {
        const startTime = Duration.fromObject({ hours: 1, minutes: 30 });
        const result = filterEventTime(
          emptyFilter,
          ignoringDaylightSavings,
          startTime,
          null,
        );
        expect(result).toEqual({
          endDate: {
            gteq: { expressions, value: "01:30" },
          },
        } as any);
      });

      it(`should create the correct time filter for a single end time, ${
        ignoringDaylightSavings ? "ignoring" : "using"
      } daylight savings time`, () => {
        const endTime = Duration.fromObject({ hours: 2, minutes: 45 });
        const result = filterEventTime(
          emptyFilter,
          ignoringDaylightSavings,
          null,
          endTime,
        );
        expect(result).toEqual({
          startDate: {
            lt: { expressions, value: "02:45" },
          },
        } as any);
      });

      it(`should create the correct time filter when given start and end times that do not overlap midnight, ${
        ignoringDaylightSavings ? "ignoring" : "using"
      } daylight savings time`, () => {
        const startTime = Duration.fromObject({ hours: 1, minutes: 30 });
        const endTime = Duration.fromObject({ hours: 2, minutes: 45 });
        const result = filterEventTime(
          emptyFilter,
          ignoringDaylightSavings,
          startTime,
          endTime,
        );
        expect(result).toEqual({
          and: [
            {
              endDate: {
                gteq: { expressions, value: "01:30" },
              },
            },
            {
              startDate: {
                lt: { expressions, value: "02:45" },
              },
            },
          ],
        } as any);
      });

      it(`should create the correct time filter when given start and end times that do overlap midnight, ${
        ignoringDaylightSavings ? "ignoring" : "using"
      } daylight savings time`, () => {
        const startTime = Duration.fromObject({ hours: 22, minutes: 0 });
        const endTime = Duration.fromObject({ hours: 1, minutes: 0 });
        const result = filterEventTime(
          emptyFilter,
          ignoringDaylightSavings,
          startTime,
          endTime,
        );
        expect(result).toEqual({
          or: [
            {
              endDate: {
                gteq: { expressions, value: "22:00" },
              },
            },
            {
              startDate: {
                lteq: { expressions, value: "01:00" },
              },
            },
            {
              endDate: {
                lteq: { expressions, value: "01:00" },
              },
            },
          ],
        } as any);
      });
    });
  });
});
