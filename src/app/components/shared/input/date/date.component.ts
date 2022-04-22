import { Component, forwardRef, Input, OnChanges } from "@angular/core";
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from "@angular/forms";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import {
  NgbCalendar,
  NgbDate,
  NgbDateParserFormatter,
  NgbDateStruct,
} from "@ng-bootstrap/ng-bootstrap";
import { getErrorMessages, shouldShowError } from "../input.helpers";

@Component({
  selector: "baw-date",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateComponent),
      multi: true,
    },
  ],
  template: `
    <div class="input-group">
      <span class="input-group-text">{{ label }}</span>
      <input
        ngbDatepicker
        #dateInput="ngbDatepicker"
        class="form-control"
        placeholder="yyyy-mm-dd"
        [class.is-valid]="showValid"
        [class.is-invalid]="showError"
        [maxDate]="maxDateStruct"
        [minDate]="minDateStruct"
        [value]="formattedDate"
        (input)="onInput($event)"
        (change)="onInput($event)"
        (dateSelect)="onSelect($event)"
        (blur)="onTouched()"
      />
      <button
        type="button"
        class="btn btn-outline-secondary"
        (click)="dateInput.toggle()"
      >
        <fa-icon [icon]="['fas', 'calendar']"></fa-icon>
      </button>
      <div *ngIf="showError" class="invalid-feedback">
        {{ errors[0] }}
      </div>
    </div>
  `,
})
export class DateComponent
  implements ControlValueAccessor, Validator, OnChanges
{
  /** Label next to input */
  @Input() public label: string;
  /** Minimum date allowed in selection */
  @Input() public minDate: Date;
  /** Maximum date allowed in selection */
  @Input() public maxDate: Date;
  /** Is input required */
  @Input() public required = false;
  /** Is input disabled */
  @Input() public disabled = false;

  // TODO Add range selection which sets the min and max dates

  /** Current value as an NgbDate structure */
  public date: NgbDate;
  /** Has value been set */
  public dirty: boolean;
  /** Current value */
  public value: Date;
  /** Has input been touched */
  public touched: boolean;

  /** Errors for current input */
  public _errors: ValidationErrors;
  /** Potential error messages */
  public errorTypes: Map<string, () => string>;
  /** Length of input yyyy-mm-dd */
  public inputLength = 10;
  /** Maximum allowed date */
  public maxDateStruct: NgbDateStruct;
  /** Minimum allowed date */
  public minDateStruct: NgbDateStruct = { year: 1970, month: 1, day: 1 };

  public constructor(
    private formatter: NgbDateParserFormatter,
    private calendar: NgbCalendar
  ) {
    this.maxDateStruct = this.calendar.getToday();
    this.errorTypes = new Map([
      ["required", () => `${this.label} is required`],
      [
        "minLength",
        () => "The time should follow the format yyyy-mm-dd, e.g. 2022-12-01",
      ],
      [
        "delimiter",
        () =>
          "Input must include a '-' between the date segments, e.g 2022-12-01",
      ],
      [
        "hour",
        () =>
          `Year must be between ${this.minDateStruct.year} and ${this.maxDateStruct.year}`,
      ],
      ["month", () => "Month must be between 1 and 12"],
      ["day", () => "Day must be between 1 and 31"],
      [
        "minDate",
        () => `Date must be after ${this.formatter.format(this.minDateStruct)}`,
      ],
      [
        "maxDate",
        () =>
          `Date must be before ${this.formatter.format(this.maxDateStruct)}`,
      ],
      ["invalid", () => "Invalid date selected"],
    ]);
  }

  public ngOnChanges(): void {
    const convertDateToStruct = (date: Date) => ({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    });
    const convertStructToDate = (struct: NgbDateStruct) =>
      new Date(struct.year, struct.month - 1, struct.day);

    if (this.minDate) {
      this.minDateStruct = convertDateToStruct(this.minDate);
    } else {
      this.minDate = convertStructToDate(this.minDateStruct);
    }

    if (this.maxDate) {
      this.maxDateStruct = convertDateToStruct(this.maxDate);
    } else {
      this.maxDate = convertStructToDate(this.maxDateStruct);
    }
  }

  /** Invoked when the model has been changed */
  public onChange: (_: Date) => void = () => {};

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
  public setDisabledState = (isDisabled: boolean) =>
    (this.disabled = isDisabled);

  /**
   * Writes a new item to the element.
   *
   * @param value the value
   */
  public writeValue(value: string): void {
    this._errors = this.validateInput(value);
    this.setDate(this.normalizeInput(value));
    if (this.errors.length === 0) {
      this.onChange(this.value);
    }
  }

  /**
   * Method that performs synchronous validation against the provided control
   */
  public validate(control: AbstractControl): ValidationErrors | null {
    return this.validateInput(control.value);
  }

  public get showValid(): boolean {
    return isInstantiated(this.value) && this.touched && !this.showError;
  }

  public get showError(): boolean {
    return shouldShowError(this.dirty, this.touched, this.errors);
  }

  public get errors(): string[] {
    return getErrorMessages(this._errors, this.errorTypes);
  }

  public validateInput(value: string | null): ValidationErrors | null {
    if (!value) {
      // No value provided on required input
      return this.required ? { required: true } : null;
    } else if (value.length < this.inputLength) {
      // Validate length of input
      return { minLength: true };
    } else if (value.split("-").length !== 3) {
      // Validate delimiters exist
      return { delimiter: true };
    }

    const segments = value.split("-");
    const year = parseInt(segments[0], 10);
    const month = parseInt(segments[1], 10);
    const day = parseInt(segments[2], 10);

    if (year < this.minDateStruct.year || year > this.maxDateStruct.year) {
      // Validate year
      return { year: true };
    } else if (month < 1 || month > 12) {
      // Validate month
      return { month: true };
    } else if (day < 1 || day > 31) {
      // Validate day
      return { day: true };
    }

    const currentDate = new Date(year, month - 1, day);
    if (currentDate.getTime() < this.minDate.getTime()) {
      // Validate date is before minimum date
      return { minDate: true };
    } else if (currentDate.getTime() > this.maxDate.getTime()) {
      // Validate date is before maximum date
      return { maxDate: true };
    }

    // Validate date is valid
    const ngbDate = NgbDate.from({ year, month, day });
    return this.calendar.isValid(ngbDate) ? null : { invalid: true };
  }

  public normalizeInput(value: string | null): NgbDate | null {
    if (!value) {
      return null;
    }

    const date = this.formatter.parse(value);
    return date && this.calendar.isValid(NgbDate.from(date))
      ? NgbDate.from(date)
      : null;
  }

  public onInput(event: Event): void {
    this.dirty = true;
    this.touched = true;
    this.onTouched();

    const value = (event.target as HTMLInputElement).value;
    this._errors = this.validateInput(value);
    this.setDate(this.normalizeInput(value));
    if (this.errors.length === 0) {
      this.onChange(this.value);
    }
  }

  public onSelect(date: NgbDate): void {
    this.dirty = true;
    this.touched = true;
    this.onTouched();

    this.setDate(date);
    this.onChange(this.value);
  }

  public get formattedDate(): string {
    return this.formatter.format(this.date);
  }

  public setDate(date: NgbDate | string): void {
    if (typeof date === "string") {
      const dateStruct = this.formatter.parse(date);
      date = this.calendar.isValid(NgbDate.from(dateStruct))
        ? NgbDate.from(dateStruct)
        : null;
    }

    if (!date) {
      this.date = undefined;
      this.value = undefined;
      this.onChange(undefined);
      return;
    }

    this.date = date;
    this.value = new Date(date.year, date.month - 1, date.day);
  }
}
