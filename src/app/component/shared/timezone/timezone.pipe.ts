import { Injectable, Pipe, PipeTransform } from "@angular/core";
import { TimezoneService } from "./timezone.service";

/**
 * Transforms any input value
 */
@Pipe({
  name: "iso2CountryPipe"
})
@Injectable()
export class TimezoneFormPipe implements PipeTransform {
  constructor(private service: TimezoneService) {}
  transform(value: string): string {
    return this.service.iso2country(value);
    // return countryList[value] ? countryList[value] : value;
  }
}
