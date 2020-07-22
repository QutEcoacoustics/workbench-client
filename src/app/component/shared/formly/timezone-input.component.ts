import { Component, OnInit } from "@angular/core";
import { FieldType } from "@ngx-formly/core";
import moment from "moment-timezone";
import { DateTime, IANAZone } from "luxon";

/**
 * Timezone Input
 */
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
          class="w-100 form-control"
          [id]="field.id"
          [formControl]="formControl"
          [formlyAttributes]="field"
          (change)="calculateCurrentTime()"
        >
          <option value=""></option>
          <ng-container *ngFor="let timezone of timezones">
            <!-- Create singular option -->
            <option [value]="timezone">
              {{ timezone }}
            </option>
          </ng-container>
        </select>
        <div class="input-group-append">
          <div class="input-group-text">
            <small>{{ offset }}</small>
          </div>
        </div>
      </div>
      <small class="form-text text-muted">{{ currentTime }}</small>
    </div>
  `,
})
// tslint:disable-next-line: component-class-suffix
export class FormlyTimezoneInput extends FieldType implements OnInit {
  public defaultTime = "(no match)";
  public timezones: string[];
  public currentTime = this.defaultTime;
  public offset: string = this.defaultTime;

  constructor() {
    super();
  }

  public ngOnInit() {
    this.timezones = moment.tz.names();
  }

  public calculateCurrentTime() {
    const key = this.field.key;
    const locale = this.field.model[key];
    const zone = IANAZone.create(locale);
    const now = DateTime.local().setZone(zone);
    this.currentTime = now.toFormat("yyyy LLL dd HH:mm");
    this.offset = zone.formatOffset(now.millisecond, "short");
    zone.offset(now.millisecond).toString();
  }
}
