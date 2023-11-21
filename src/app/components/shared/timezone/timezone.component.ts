import { Component, Input, OnChanges } from "@angular/core";
import { DateTimeTimezone } from "@interfaces/apiInterfaces";
import {
  AbstractModel,
  isUnresolvedModel,
  UnresolvedModel,
} from "@models/AbstractModel";
import { Site } from "@models/Site";

@Component({
  selector: "baw-date",
  template: `
    <span [ngbTooltip]="timezone">
      {{ formattedDate }}
    </span>
  `,
  styles: [
    `
      span {
        text-decoration: underline dotted;
        cursor: help;
        text-decoration-skip-ink: none;
      }
    `,
  ],
})
export class TimezoneComponent implements OnChanges {
  @Input() public dateTime: DateTimeTimezone;
  @Input() public site: UnresolvedModel | Site;
  @Input() public dateFormat: (date: DateTimeTimezone) => string = (date) =>
    date.toFormat("yyyy-LL-dd HH:mm");
  public formattedDate: string;
  public timezone: string;

  public ngOnChanges(): void {
    if (!this.dateTime) {
      this.formattedDate = "Unknown";
      return;
    }

    if (isUnresolvedModel(this.site)) {
      this.timezone = "loading...";
      this.formattedDate = this.dateFormat(
        this.dateTime.setZone(this.timezone)
      );
    } else if (this.site?.tzinfoTz) {
      this.timezone = this.site.tzinfoTz;
      this.formattedDate = this.dateFormat(
        this.dateTime.setZone(this.timezone)
      );
    } else {
      this.timezone = this.dateTime.zoneName;
      this.formattedDate = this.dateFormat(this.dateTime);
    }
  }
}

export type AbstractModelWithSite = AbstractModel & { site?: Site };
