import { DateExpressions, InnerFilter } from "@baw-api/baw-api.service";
import { AudioRecording } from "@models/AudioRecording";
import { DateTime, Duration } from "luxon";
import { filterAnd } from "./filters";

/**
 * Adds date range conditions to an existing filter in the ISO8601 date format
 *
 * @param filters An existing filter to add the date range conditions to. If no filter is provided, a new filter will be created
 * @param startDate (optional) The minimum `recordedDate` of the date range
 * @param endDate (optional) The maximum `recordedEndDate` allowed
 * @returns A new filter with all the same conditions as the initial filter, with the date range conditions added in an `and` expression
 */
export function filterDate(
  filters: InnerFilter<AudioRecording>,
  startDate?: DateTime,
  endDate?: DateTime
): InnerFilter<AudioRecording> {
  if (startDate) {
    // to return the most data that matches the date range interval we want to return any audio recordings that have any audio that overlaps
    // with the date range interval. But we don't want to return any recordings that just touch on the ends
    // therefore, the conditions should be `recordedEndDate > startFilterDate && recordedDate < endFilterDate`
    const startDateFilter = {
      recordedEndDate: { greaterThan: startDate },
    } as InnerFilter<AudioRecording>;

    filters = filterAnd<AudioRecording>(filters, startDateFilter);
  }

  if (endDate) {
    const endDateFilters: InnerFilter<AudioRecording> = {
      recordedDate: { lessThan: endDate },
    };

    filters = filterAnd<AudioRecording>(filters, endDateFilters);
  }

  return filters;
}

/**
 * Adds time range conditions to an existing filter
 *
 * @param filters An existing filter to add the time range conditions to. If no filter is provided, a new filter will be created
 * @param ignoreDayLightSavings Describes if the time filters use local (daylight savings) time
 * @param startTime (optional) The minimum `recordedDate` allowed
 * @param endTime (optional) The maximum `recordedEndDate` allowed
 * @returns A new filter with all the same conditions as the initial filter, with the time range conditions added in an `and` expression
 */
export function filterTime(
  filters: InnerFilter<AudioRecording>,
  ignoreDayLightSavings: boolean,
  startTime?: Duration,
  endTime?: Duration
): InnerFilter<AudioRecording> {
  // the api expects time filters to be in the format of "hh:mm" (e.g. 08:12)
  // since Luxon's Duration toJSON() method outputs the times in the ISO 8601 period format (e.g. P23DT23H)
  // we have to format times at filter creation to the expected hh:mm format
  const timeFormat = "hh:mm";
  const expressions: DateExpressions[] = ignoreDayLightSavings
    ? ["local_offset", "time_of_day"]
    : ["local_tz", "time_of_day"];

  const formattedStartTime = startTime?.toFormat(timeFormat);
  const formattedEndTime = endTime?.toFormat(timeFormat);

  // a midnight filter is a filter circumstance where the time range overlaps two days e.g. 10PM to 1AM
  // therefore, midnight filters can only occur if both a start and end time are specified and the start time occurs after the end time
  const isMidnightFilter = startTime && endTime && startTime > endTime;

  if (isMidnightFilter) {
    const timeInnerFilter: InnerFilter<AudioRecording> = {
      or: [
        {
          recordedEndDate: {
            greaterThanOrEqual: { expressions, value: formattedStartTime },
          },
        },
        {
          recordedDate: {
            lessThanOrEqual: { expressions, value: formattedEndTime },
          },
        },
        {
          recordedEndDate: {
            lessThanOrEqual: { expressions, value: formattedEndTime },
          },
        },
      ],
    };

    filters = filterAnd(filters, timeInnerFilter);
  } else {
    if (startTime) {
      const startTimeFilter = {
        recordedEndDate: {
          greaterThan: { expressions, value: formattedStartTime },
        },
      };

      // We do this override because recordedEndDate is a virtual field that we
      // can filter by, but does not exist on the database or audio recording
      // model emitted by the api.
      //
      // TODO: Remove this type cast once we add support for typing virtual
      // fields on filter bodies.
      filters = filterAnd(filters, startTimeFilter as InnerFilter<AudioRecording>);
    }

    if (endTime) {
      const endTimeFilter = {
        recordedDate: {
          lessThan: { expressions, value: formattedEndTime },
        },
      };

      filters = filterAnd(filters, endTimeFilter);
    }
  }

  return filters;
}
