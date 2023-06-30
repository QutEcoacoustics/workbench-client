import { Pipe, PipeTransform } from "@angular/core";
import { Duration } from "luxon";

@Pipe({
  name: "time"
})
export class TimePipe implements PipeTransform {
  public transform(value: Duration): string {
    return value.toFormat("hh:mm");
  }
}
