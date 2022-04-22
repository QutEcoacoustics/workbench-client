import { Component, Input } from "@angular/core";
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from "@angular/forms";
import { DateTime } from "luxon";
import { getErrorMessages, shouldShowError } from "../input.helpers";

@Component({
  selector: "baw-time",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: TimeComponent,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: TimeComponent,
    },
  ],
  template: `
    <div class="input-group">
      <span class="input-group-text">{{ label }}</span>
      <input
        class="form-control"
        placeholder="hh:mm"
        [maxLength]="inputLength"
        [class.is-invalid]="showError"
        [required]="required"
        [disabled]="disabled"
        [value]="value ?? ''"
        (input)="onInput($event)"
        (change)="onInput($event)"
        (blur)="onTouched()"
      />
      <div *ngIf="showError" class="invalid-feedback">
        {{ errors[0] }}
      </div>
    </div>
  `,
})
export class TimeComponent implements ControlValueAccessor, Validator {
  /** Time increments in seconds */
  @Input() public increment = 1800;
  /** Label next to input */
  @Input() public label: string;
  /** Is input required */
  @Input() public required = false;
  /** Is input disabled */
  @Input() public disabled = false;

  /** Current value */
  public value: string;
  /** Has value been set */
  public dirty: boolean;
  /** Has input been touched */
  public touched: boolean;

  /** Errors for current input */
  public _errors: ValidationErrors;
  /** Potential error messages */
  public errorTypes: Map<string, () => string>;
  /** Length of input hh:mm */
  public inputLength = 5;

  public constructor() {
    this.errorTypes = new Map([
      ["required", () => `${this.label} is required`],
      ["length", () => "The time should follow the format hh:mm, e.g. 15:30"],
      ["delimiter", () => "Input must include a ':'"],
      ["hour", () => "Hours must be between 00 and 24"],
      ["minute", () => "Minutes must be between 00 and 59"],
      ["afterMidnight", () => "Times after 24:00 are invalid"],
      ["invalid", () => "Invalid time selected"],
    ]);
  }

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
  public setDisabledState = (isDisabled: boolean) =>
    (this.disabled = isDisabled);

  /**
   * Writes a new item to the element.
   *
   * @param value the value
   */
  public writeValue(value: string): void {
    this.value = value;
    this.updateChanges();
  }

  /**
   * Method that performs synchronous validation against the provided control
   */
  public validate(control: AbstractControl): ValidationErrors | null {
    return this.validateInput(control.value);
  }

  public get showError(): boolean {
    return shouldShowError(this.dirty, this.touched, this.errors);
  }

  public get errors(): string[] {
    return getErrorMessages(this._errors, this.errorTypes);
  }

  public onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = this.normalizeInput(value);
    this._errors = this.validateInput(this.value);

    if (this.value) {
      this.dirty = true;
      this.touched = true;
      this.onTouched();
    }

    // Update model if valid input given
    if (this.errors.length === 0) {
      this.onChange(this.value);
    }
  }

  public normalizeInput(value: string): string {
    if (!value) {
      return undefined;
    }

    let output: string;
    if (value.length < (this.value?.length ?? 0)) {
      output = value.endsWith(":") ? value.slice(0, -1) : value;
    } else {
      output = value;
    }

    const hasColon = output.includes(":");
    if (!hasColon && output.length >= 3) {
      output = output.slice(0, 2) + ":" + output.slice(2);
    }

    return output;
  }

  public validateInput(value: string): ValidationErrors | null {
    if (!value) {
      // No value provided on required input
      return this.required ? { required: true } : null;
    } else if (value.length !== this.inputLength) {
      // Input is not the correct length
      return { length: true };
    } else if (!value.includes(":")) {
      // Input missing a colon
      return { delimiter: true };
    } else if (!validHoursRegex.test(value)) {
      // Input hours are between 00 - 24
      return { hour: true };
    } else if (!validMinutesRegex.test(value)) {
      // Input minutes are between 00 - 59
      return { minute: true };
    } else if (value.startsWith("24") && !value.endsWith("00")) {
      // Input that only 24:00 is valid
      return { afterMidnight: true };
    } else {
      // Input time is valid
      const date = DateTime.fromFormat(value, "HH:mm");
      return date.isValid ? null : { invalid: true };
    }
  }
}

/** Validate the hours portion of a time follows the format hh: with numbers between 0 and 24 */
const validHoursRegex = /^(([0-1]\d)|2[0-4]):/;
/** Validate the minutes portion of a time follows the format :mm with numbers between 0 and 59 */
const validMinutesRegex = /(:[0-5]\d)$/;
