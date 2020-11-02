import { Pipe, PipeTransform } from "@angular/core";
import { HumanizeDurationOptions, toRelative } from "@interfaces/apiInterfaces";
import { DateTime, Duration, ToRelativeOptions } from "luxon";

/**
 * Convert Durations and DateTimes to their relative string format
 */
@Pipe({
  name: "toRelative",
})
export class ToRelativePipe implements PipeTransform {
  public transform(
    value: Duration | DateTime,
    options: HumanizeDurationOptions | ToRelativeOptions
  ): string {
    if (!value) {
      return "(no value)";
    }

    return value instanceof Duration
      ? toRelative(value, options as HumanizeDurationOptions)
      : value.toRelative(options as ToRelativeOptions);
  }
}
