import { Pipe, PipeTransform } from "@angular/core";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { DateTime } from "luxon";

export interface DateTimePipeOptions {
  includeTime?: boolean;
  localTime?: boolean;
}

// we use a custom pipe to format dates because the date pipe supported by Angular doesn't support Luxon dates
// this pipe is used to convert a Luxon DateTime object into a JavaScript Date object before passing it to the Angular date pipe
// this retains all the functionality and options of the Angular date pipe while allowing us to use Luxon dates without
// having to cast to a JavaScript Date object in each component
// using this pipe also allows us to standardise the date format throughout the client
@Pipe({
  name: "dateTime",
  standalone: false
})
export class DateTimePipe implements PipeTransform {
  public constructor() {}

  public transform(value?: DateTime, options?: DateTimePipeOptions): string {
    if (!isInstantiated(value)) {
      return "";
    }

    const dateFormat = "yyyy-MM-dd";
    const dateTimeFormat = "yyyy-MM-dd HH:mm:ss";

    const localizedDate = options?.localTime === true ? value.toLocal() : value;

    return localizedDate.toFormat(
      options?.includeTime === true ? dateTimeFormat : dateFormat
    );
  }
}
