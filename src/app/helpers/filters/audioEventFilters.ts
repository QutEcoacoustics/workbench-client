import { DateExpressions, InnerFilter } from "@baw-api/baw-api.service";
import { AudioEvent } from "@models/AudioEvent";
import { DateTime, Duration } from "luxon";
import { filterAnd } from "./filters";

// General note: we want to cast a wide net. So for lower date filters,
// we filter of of the event's endDate (as in any that ends after our minimum date)
// and for upper date filters, we filter off of the event's startDate
// (as in any that starts before our maximum date).
// This creates some seemingly counterintuitive filter conditions when viewed in isolation.

/**
 * Adds date range conditions to an existing filter in the ISO8601 date format
 *
 * @param filters An existing filter to add the date range conditions to. If no filter is provided, a new filter will be created
 * @param minimumDate (optional) The minimum event `endDate` of the date range
 * @param maximumDate (optional) The maximum event `startDate` allowed
 * @returns A new filter with all the same conditions as the initial filter, with the date range conditions added in an `and` expression
 */
export function filterEventDate(
  filters: InnerFilter<AudioEvent>,
  minimumDate?: DateTime,
  maximumDate?: DateTime,
): InnerFilter<AudioEvent> {
  if (minimumDate) {
    const startDateFilter = {
      endDate: { gteq: minimumDate },
    } as InnerFilter<AudioEvent>;

    filters = filterAnd<AudioEvent>(filters, startDateFilter);
  }

  if (maximumDate) {
    const endDateFilters: InnerFilter<AudioEvent> = {
      startDate: { lt: maximumDate },
    } as InnerFilter<AudioEvent>;

    filters = filterAnd<AudioEvent>(filters, endDateFilters);
  }

  return filters;
}

/**
 * Adds time range conditions to an existing filter
 *
 * @param filters An existing filter to add the time range conditions to. If no filter is provided, a new filter will be created
 * @param ignoreDayLightSavings Describes if the time filters use local (daylight savings) time
 * @param minimumTime (optional) The minimum `startDate` allowed
 * @param maximumTime (optional) The maximum `endDate` allowed
 * @returns A new filter with all the same conditions as the initial filter, with the time range conditions added in an `and` expression
 */
export function filterEventTime(
  filters: InnerFilter<AudioEvent>,
  ignoreDayLightSavings: boolean,
  minimumTime?: Duration,
  maximumTime?: Duration,
): InnerFilter<AudioEvent> {
  // the api expects time filters to be in the format of "hh:mm" (e.g. 08:12)
  // since Luxon's Duration toJSON() method outputs the times in the ISO 8601 period format (e.g. P23DT23H)
  // we have to format times at filter creation to the expected hh:mm format
  const timeFormat = "hh:mm";
  const expressions: DateExpressions[] = ignoreDayLightSavings
    ? ["local_offset", "time_of_day"]
    : ["local_tz", "time_of_day"];

  const formattedStartTime = minimumTime?.toFormat(timeFormat);
  const formattedEndTime = maximumTime?.toFormat(timeFormat);

  // a midnight filter is a filter circumstance where the time range overlaps two days e.g. 10PM to 1AM
  // therefore, midnight filters can only occur if both a start and end time are specified and the start time occurs after the end time
  const isMidnightFilter =
    minimumTime && maximumTime && minimumTime > maximumTime;

  if (isMidnightFilter) {
    const timeInnerFilter: InnerFilter<AudioEvent> = {
      or: [
        {
          endDate: {
            gteq: { expressions, value: formattedStartTime },
          },
        },
        {
          startDate: {
            lteq: { expressions, value: formattedEndTime },
          },
        },
        {
          endDate: {
            lteq: { expressions, value: formattedEndTime },
          },
        },
      ],
    };

    filters = filterAnd(filters, timeInnerFilter);
  } else {
    if (minimumTime) {
      const startTimeFilter = {
        endDate: {
          gteq: { expressions, value: formattedStartTime },
        },
      };

      filters = filterAnd(filters, startTimeFilter as InnerFilter<AudioEvent>);
    }

    if (maximumTime) {
      const endTimeFilter = {
        startDate: {
          lt: { expressions, value: formattedEndTime },
        },
      };

      filters = filterAnd(filters, endTimeFilter as InnerFilter<AudioEvent>);
    }
  }

  return filters;
}
