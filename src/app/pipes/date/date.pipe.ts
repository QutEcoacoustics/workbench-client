import { DatePipe } from "@angular/common";
import { Pipe, PipeTransform } from "@angular/core";
import { DateTime } from "luxon";

// we use a custom pipe to format dates because the date pipe supported by Angular doesn't support Luxon dates
// this pipe is used to convert a Luxon DateTime object into a JavaScript Date object before passing it to the Angular date pipe
// this retains all the functionality and options of the Angular date pipe while allowing us to use Luxon dates without
// having to cast to a JavaScript Date object in each component
// using this pipe also allows us to change the format of all dates within the client at once
@Pipe({
  name: "dateTime"
})
export class DateTimePipe implements PipeTransform {
  public constructor(
    private angularDatePipe: DatePipe
  ) {}

  public transform(value: DateTime): string {
    const dateFormat = "yyyy-MM-dd";
    return this.angularDatePipe.transform(value.toJSDate(), dateFormat);
  }
}
