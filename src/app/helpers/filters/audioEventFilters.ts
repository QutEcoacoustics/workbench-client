import { InnerFilter } from "@baw-api/baw-api.service";
import { AudioEvent } from "@models/AudioEvent";
import { DateTime, Duration } from "luxon";

//! FOR PR REVIEWER: THIS IS WHERE I AM CURRENTLY UP TO
/**
 * Adds date range conditions to an existing AudioEvent filter in the ISO8601
 * date format
 *
 * @param initialFilter An existing filter to add the date range conditions to.
 * @param startDate (optional) The minimum `recordedDate` of the date range
 * @param endDate (optional) The maximum `recordedEndDate` allowed
 */
export function filterDate(
  initialFilter: InnerFilter<AudioEvent>,
  startDate?: DateTime,
  endDate?: DateTime
): InnerFilter<AudioEvent> {
  if (startDate) {}

  if (endDate) {}

  return initialFilter;
}

//! FOR PR REVIEWER: THIS IS WHERE I AM CURRENTLY UP TO
/**
 * Adds time range conditions to an existing AudioEvent filter
 *
 * @param initialFilter An existing filter to add the time range conditions to.
 * @param ignoreDayLightSavings Describes if the time filters use local (daylight savings) time
 * @param startTime (optional) The minimum `recordedDate` allowed
 * @param endTime (optional) The maximum `recordedEndDate` allowed
 */
export function filterTime(
  initialFilter: InnerFilter<AudioEvent>,
  ignoreDayLightSavings: boolean,
  startTime?: Duration,
  endTime?: Duration
): InnerFilter<AudioEvent> {
}
