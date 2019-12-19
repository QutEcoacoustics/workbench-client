import { AfterViewInit, Component, Input, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { FieldType } from "@ngx-formly/core";
import moment from "moment";
import "moment-timezone";
import { Timezone, TimezoneService } from "../timezone/timezone.service";

@Component({
  // tslint:disable-next-line: component-selector
  selector: "formly-timezone-input",
  template: `
    <div class="form-group">
      <label *ngIf="field.templateOptions.label" [for]="field.id">
        {{
          field.templateOptions.label +
            (field.templateOptions.required ? " *" : "")
        }}
      </label>

      <div class="input-group">
        <select
          id="select"
          class="w-100 form-control"
          [formControl]="formControl"
          [formlyAttributes]="field"
        >
          <option></option>
          <ng-container *ngFor="let timezone of timezones">
            <ng-container *ngIf="timezone.zones.length === 1; else group">
              <!-- Create singular option -->
              <option [value]="offsetOfTimezone(timezone.zones[0])">
                {{ timezone.iso | iso2CountryPipe }}
              </option>
            </ng-container>
            <ng-template #group>
              <!-- Create subgroup of countries with same timezone -->
              <optgroup [label]="timezone.iso | iso2CountryPipe">
                <option
                  *ngFor="let zone of timezone.zones"
                  [value]="offsetOfTimezone(zone)"
                >
                  {{ timezone.iso | iso2CountryPipe }} -
                  {{ formatTimezoneString(zone) }}
                </option>
              </optgroup>
            </ng-template>
          </ng-container>
        </select>
        <div class="input-group-append">
          <div class="input-group-text">{{ model[key] || "(no match)" }}</div>
        </div>
      </div>
    </div>
  `
})
// tslint:disable-next-line: component-class-suffix
export class FormlyTimezoneInput extends FieldType
  implements OnInit, AfterViewInit {
  @Input() disabled = false;

  /**
   * All time zones combined in one array, for each country
   */
  timezones: Timezone[];
  formControl: FormControl;

  constructor(public service: TimezoneService) {
    super();
  }

  ngOnInit() {
    this.timezones = this.service.getZones();
  }

  ngAfterViewInit() {}

  /**
   * Format a timezone into a human readable format
   * @param zone Zone to format
   */
  formatTimezoneString(zone: string): string {
    const arr = zone.split("/");
    return arr[arr.length - 1].replace("_", " ");
  }

  /**
   * Produce a string with the offset of a timezone
   * @param zone Timezone
   */
  offsetOfTimezone(zone: string): string {
    let offset = moment.tz(zone).utcOffset();
    const negativeOffset = offset < 0;

    if (negativeOffset) {
      offset *= -1;
    }

    const hours = Math.floor(offset / 60);
    const minutes = (offset / 60 - hours) * 60;
    return (
      "GMT" +
      (negativeOffset ? "-" : "+") +
      this.numberPadding(hours, 2) +
      ":" +
      this.numberPadding(minutes, 2)
    );
  }

  /**
   * Prepend padding to a number
   * @param num Number to pad
   * @param places Number of places to pad to
   * @param padding Padding filler (defaults to '0')
   */
  private numberPadding(
    num: number,
    places: number,
    padding: string = "0"
  ): string {
    return String(num).padStart(places, padding);
  }
}
