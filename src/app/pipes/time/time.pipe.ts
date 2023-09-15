import { Pipe, PipeTransform } from "@angular/core";
import { Duration } from "luxon";

// to ensure standardization across the client, we use a custom pipe to format durations
/** Converts a Luxon Duration to a standardized string format */
@Pipe({
  name: "time"
})
export class TimePipe implements PipeTransform {
  public transform(value: Duration): string {
    return value.toFormat("hh:mm");
  }
}
