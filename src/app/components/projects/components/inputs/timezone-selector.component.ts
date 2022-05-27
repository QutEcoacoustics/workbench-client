import { Component, Input } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";

@Component({
  selector: "baw-utc-offset-selector",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: UTCOffsetSelectorComponent,
    },
  ],
  template: `
    <div *ngIf="value" class="utc-label">
      <span>{{ value }}</span>

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
      *ngIf="!value"
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
export class UTCOffsetSelectorComponent implements ControlValueAccessor {
  @Input() public project: Project;
  @Input() public region: Region;
  @Input() public site: Site;

  /** Current value */
  public value: string;
  /** Has value been set */
  public dirty: boolean;
  /** Has input been touched */
  public touched: boolean;

  /** Invoked when the model has been changed */
  public onChange: (_: string) => void = () => {};

  /** Invoked when the model has been touched */
  public onTouched: () => void = () => {};

  /** Method that is invoked on an update of a model. */
  public updateChanges = () => this.onChange(this.value);

  /**
   * Registers a callback function that should be called when the control's value changes in the UI.
   *
   * @param fn
   */
  public registerOnChange = (fn: any): void => (this.onChange = fn);

  /**
   * Registers a callback function that should be called when the control receives a blur event.
   *
   * @param fn
   */
  public registerOnTouched = (fn: any): void => (this.onTouched = fn);

  /**
   * Method that is invoked when the control status changes to or from "DISABLED".
   */
  public setDisabledState = (_: boolean) => {};

  /**
   * Writes a new item to the element.
   *
   * @param value the value
   */
  public writeValue(value: string): void {
    this.value = value;
    this.updateChanges();
  }

  public get editTooltip(): string {
    return "Change the utc offset for this recordings stored in this folder";
  }

  public resetSite(): void {
    this.value = undefined;
    this.updateChanges();
  }

  public onSelection(offset: string): void {
    this.value = offset;
    this.updateChanges();
  }

  /**
   * All possible UTC offsets, this may desync over time, and can be reviewed
   * if users request a timezone which is not listed here
   * https://en.wikipedia.org/wiki/List_of_UTC_offsets
   */
  public offsets = [
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
