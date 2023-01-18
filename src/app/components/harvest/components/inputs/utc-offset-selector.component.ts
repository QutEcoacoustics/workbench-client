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
    if (isInstantiated(this.site?.timezoneInformation)) {
      return [
        this.convertUnixOffsetToUTCOffset(
          this.site.timezoneInformation.utcOffset
        ),
        this.site.timezoneInformation.utcOffset !== this.site.timezoneInformation.utcTotalOffset &&
          this.convertUnixOffsetToUTCOffset(this.site.timezoneInformation.utcTotalOffset),
        this.relevantOffsetListSeparator,
      ];
    }

    // the selected site does not have any timezone / location information
    return [];
  }

  /**
   * Returns a list of UTC offsets with the relevant offsets appended to the top
   */
  public get offsets(): string[] {
    return this.relevantUTCOffsets.concat(UTCOffsetSelectorComponent.offsets);
  }

  public convertUnixOffsetToUTCOffset(unixOffset: number): string {
    // unix offset is in relative seconds. Therefore, if we divide the number by 3600, we get the offset as an hour decimal
    const timeDecimal = unixOffset / 3600;

    // eslint-disable-next-line max-len
    return `${timeDecimal >= 0 ? "+" : "-"}${timeDecimal.toString().split(".")[0]}:00`;
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
