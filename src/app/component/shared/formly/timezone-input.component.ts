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
          class="form-control"
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
          <span class="input-group-text">
            <small>{{ offset }}</small>
          </span>
        </div>
      </div>
    </div>
  `,
})
// tslint:disable-next-line: component-class-suffix
export class FormlyTimezoneInput extends FieldType implements OnInit {
  public defaultTime = "(no match)";
  public timezones: string[];
  public offset: string = this.defaultTime;

  constructor() {
    super();
  }

  public ngOnInit() {
    this.timezones = moment.tz.names();
  }

  public calculateCurrentTime(): void {
    const zoneName = this.field.model[this.field.key];

    if (!IANAZone.isValidZone(zoneName)) {
      this.offset = this.defaultTime;
      return;
    }

    const zone = IANAZone.create(zoneName);
    const now = DateTime.local().setZone(zone);
    this.offset = zone.formatOffset(now.millisecond, "short");
  }
}
