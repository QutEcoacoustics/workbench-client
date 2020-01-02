import { AfterContentInit, Component, OnChanges, OnInit } from "@angular/core";
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
          (change)="calculateCurrentTime()"
        >
          <option value=""></option>
          <ng-container *ngFor="let timezone of timezones">
            <ng-container *ngIf="timezone.zones.length === 1; else group">
              <!-- Create singular option -->
              <option [value]="timezone.zones[0]">
                {{ timezone.iso | iso2CountryPipe }}
              </option>
            </ng-container>
            <ng-template #group>
              <!-- Create subgroup of countries with same timezone -->
              <optgroup [label]="timezone.iso | iso2CountryPipe">
                <option *ngFor="let zone of timezone.zones" [value]="zone">
                  {{ timezone.iso | iso2CountryPipe }} -
                  {{ formatTimezoneString(zone) }}
                </option>
              </optgroup>
            </ng-template>
          </ng-container>
        </select>
        <div class="input-group-append">
          <div class="input-group-text">
            <small>{{
              model[key] ? offsetOfTimezone(model[key]) : "(no match)"
            }}</small>
          </div>
        </div>
      </div>
      <small class="form-text text-muted">{{ currentTime }}</small>
    </div>
  `
})
// tslint:disable-next-line: component-class-suffix
export class FormlyTimezoneInput extends FieldType implements OnInit {
  timezones: Timezone[];
  formControl: FormControl;
  previousValue: string;
  currentTime: string;

  constructor(public service: TimezoneService) {
    super();
  }

  ngOnInit() {
    this.timezones = this.service.getZones();
    this.previousValue = this.model[this.key];
  }

  /**
   * Format a zone into a human readable format
   * eg. Australia/Lord_Howe => Australia - Lord Howe
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
    const abbreviation = moment.tz(zone).zoneAbbr();

    // Check if abbreviation is known
    if (abbreviation.includes("+") || abbreviation.includes("-")) {
      return moment.tz(zone).format("(Z)");
    } else {
      return moment.tz(zone).format("z (Z)");
    }
  }

  calculateCurrentTime() {
    if (this.model[this.key] && this.model[this.key] !== "") {
      this.currentTime = moment(new Date())
        .tz(this.model[this.key])
        .format("[Currently:] dddd, MMMM Do YYYY, h:mm:ss a z (Z)");
    } else {
      this.currentTime = "";
    }
  }
}
