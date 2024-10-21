import { InnerFilter } from "@baw-api/baw-api.service";
import { AudioRecording } from "@models/AudioRecording";
import { DateTime } from "luxon";
import { filterAnd } from "./filters";

/**
 * Adds date range conditions to an existing filter in the ISO8601 date format
 *
 * @param filters An existing filter to add the date range conditions to. If no filter is provided, a new filter will be created
 * @param startDate (optional) The minimum `recordedDate` of the date range
 * @param endDate (optional) The maximum `recordedEndDate` allowed
 * @returns A new filter with all the same conditions as the initial filter, with the date range conditions added in an `and` expression
 */
export function filterEventRecordingDate(
  filters: InnerFilter<AudioRecording>,
  startDate?: DateTime,
  endDate?: DateTime
): InnerFilter<AudioRecording> {
  if (startDate) {
    // to return the most data that matches the date range interval we want to return any audio recordings that have any audio that overlaps
    // with the date range interval. But we don't want to return any recordings that just touch on the ends
    // therefore, the conditions should be `recordedEndDate > startFilterDate && recordedDate < endFilterDate`
    const startDateFilter = {
      "audioRecording.recordedEndDate": { greaterThan: startDate },
    } as InnerFilter<AudioRecording>;

    filters = filterAnd<AudioRecording>(filters, startDateFilter);
  }

  if (endDate) {
    const endDateFilters: InnerFilter<AudioRecording> = {
      "audioRecording.recordedDate": { lessThan: endDate },
    } as InnerFilter<AudioRecording>;

    filters = filterAnd<AudioRecording>(filters, endDateFilters);
  }

  return filters;
}
