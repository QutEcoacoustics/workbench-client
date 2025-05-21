import { DecimalPipe } from "@angular/common";
import { Pipe, PipeTransform } from "@angular/core";

/**
 * A number pipe that will conditionally return an error message if the value
 * passed in is not a number.
 */
@Pipe({ name: "errorableNumber" })
export class ErrorableNumberPipe extends DecimalPipe implements PipeTransform {
  public constructor() {
    super("en-US");
  }

  public override transform(value: unknown, digitsInfo?: string, locale?: string): any {
    const valueType = typeof value;
    if (valueType !== "number" && valueType !== "string") {
      return "Incorrect data type";
    }

    return super.transform(value as any, digitsInfo, locale);
  }
}
