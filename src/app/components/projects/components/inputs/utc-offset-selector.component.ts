import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "baw-utc-offset-selector",
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
      <option selected disabled>Select UTC Offset</option>
      <option *ngFor="let offset of offsets" [value]="offset">
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
        min-width: 170px;
      }
    `,
  ],
})
export class UTCOffsetSelectorComponent {
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

  public get offsets(): string[] {
    return UTCOffsetSelectorComponent.offsets;
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
