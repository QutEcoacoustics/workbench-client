import { Component, EventEmitter, Input, Output } from "@angular/core";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { Site } from "@models/Site";

@Component({
  selector: "baw-harvest-utc-offset-selector",
  template: `
    <div *ngIf="offset" class="utc-label">
      <span>{{ offset }}</span>

      <div>
        <button
          type="button"
          class="btn btn-sm p-0 me-1"
          [ngbTooltip]="editTooltip"
          (click)="resetSite()"
        >
          <fa-icon [icon]="['fas', 'pen-to-square']"></fa-icon>
        </button>
      </div>
    </div>
    <select
      *ngIf="!offset"
      class="form-select form-select-sm"
      aria-label="UTC offset"
      (change)="onSelection($any($event).target.value)"
    >
      <option selected disabled>Select offset</option>
      <option *ngFor="let offset of offsets" [value]="offset" [disabled]="offset === relevantOffsetListSeparator">
        {{ offset }}
      </option>
    </select>
  `,
  styles: [
    `
      .utc-label {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .utc-label,
      select {
        width: 100%;
      }
    `,
  ],
})
export class UTCOffsetSelectorComponent {
  protected relevantOffsetListSeparator = "---";

  // the UTC input component needs knowledge of the site so that it can suggest the relevant UTC offsets relative to the site location
  @Input() public site: Site;
  @Input() public offset: string;
  @Output() public offsetChange = new EventEmitter<string>();

  public get editTooltip(): string {
    return "Change the utc offset for this recordings stored in this folder";
  }

  public resetSite(): void {
    this.offset = null;
    this.offsetChange.emit(this.offset);
  }

  public onSelection(offset: string): void {
    this.offset = offset;
    this.offsetChange.emit(this.offset);
  }

  /**
   * Returns the UTC offsets that are relevant to the site location
   */
  public get relevantUTCOffsets(): string[] {
    const foundRelevantOffsets = Array<string>();

    // if the site or timezone information is not set, it can be assumed that there are no relevant / suggested time zones
    if (isInstantiated(this.site?.timezoneInformation)) {
      const utcOffset = this.site.timezoneInformation.utcOffset;
      const totalUtcOffset = this.site.timezoneInformation.utcTotalOffset;

      foundRelevantOffsets.push(this.convertUnixOffsetToUTCOffset(utcOffset));

      // if the total offset is not equal to the utc offset, this is an indicator of two potential time offsets.
      // e.g. daylight savings time
      if (utcOffset !== totalUtcOffset) {
        foundRelevantOffsets.push(this.convertUnixOffsetToUTCOffset(totalUtcOffset));
      }

      // add a separator that the user can not select to distinguish between relevant and all utc offsets
      foundRelevantOffsets.push(this.relevantOffsetListSeparator);
    }

    return foundRelevantOffsets;
  }

  /**
   * Returns a list of UTC offsets with the relevant offsets appended to the top
   */
  public get offsets(): string[] {
    return this.relevantUTCOffsets.concat(UTCOffsetSelectorComponent.offsets);
  }

  public convertUnixOffsetToUTCOffset(unixOffset: number): string {
    const directionalIndicator = unixOffset >= 0 ? "+" : "-";

    // unix offset is in relative seconds. Therefore, if we divide the number by 3600, we get the offset as an hour decimal
    const secondsToHoursScalarMultiple = 3600;

    // assert that the provided dates are within the legal range. If not, throw an error
    if (unixOffset >= (12 * secondsToHoursScalarMultiple) || unixOffset <= (-12 * secondsToHoursScalarMultiple)) {
      throw new Error("UTC Offset out of bounds.");
    }

    const utcOffsetTime = new Date(0);
    utcOffsetTime.setHours(unixOffset / secondsToHoursScalarMultiple);

    let hoursTimeFormat = utcOffsetTime.getHours();

    // since -1 is the same as +23, it will be encoded as +23 at this point
    // however, since the user is expecting -1, subtracting 24 hours (if greater than 12 hours) will return the result the user is expecting
    if (hoursTimeFormat > 12) {
      hoursTimeFormat -= 24; // hours
    }

    const hours: string = directionalIndicator + hoursTimeFormat.toString().replace("-", "").padStart(2, "0");
    const minutes: string = utcOffsetTime.getMinutes().toString().padStart(2, "0");

    return `${hours}:${minutes}`;
  }

  /**
   * All possible UTC offsets, this may desync over time, and can be reviewed
   * if users request a timezone which is not listed here
   * https://en.wikipedia.org/wiki/List_of_UTC_offsets
   */
  public static offsets = [
    "-12:00",
    "-11:00",
    "-10:30",
    "-10:00",
    "-09:30",
    "-09:00",
    "-08:30",
    "-08:00",
    "-07:00",
    "-06:00",
    "-05:00",
    "-04:30",
    "-04:00",
    "-03:30",
    "-03:00",
    "-02:30",
    "-02:00",
    "-01:00",
    "-00:44",
    // Not supported because of seconds
    // "-00:25:21",
    "+00:00",
    "+00:20",
    "+00:30",
    "+01:00",
    "+01:24",
    "+01:30",
    "+02:00",
    "+02:30",
    "+03:00",
    "+03:30",
    "+04:00",
    "+04:30",
    "+04:51",
    "+05:00",
    "+05:30",
    "+05:40",
    "+05:45",
    "+06:00",
    "+06:30",
    "+07:00",
    "+07:20",
    "+07:30",
    "+08:00",
    "+08:30",
    "+08:45",
    "+09:00",
    "+09:30",
    "+09:45",
    "+10:00",
    "+10:30",
    "+11:00",
    "+11:30",
    "+12:00",
    "+12:45",
    "+13:00",
    "+13:45",
    "+14:00",
  ];
}
