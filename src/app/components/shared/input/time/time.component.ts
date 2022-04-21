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
        [class.is-valid]="value && touched && !showError"
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
  styles: [
    `
      .required {
        label::after {
          content: "*";
          position: relative;
          top: -3px;
          left: 3px;
          font-size: 0.85rem;
          color: red;
        }
      }
    `,
  ],
})
export class TimeComponent implements ControlValueAccessor, Validator {
  /** Time increments in seconds */
  @Input() public increment = 1800;
  /** Label next to input */
  @Input() public label: string;
  @Input() public required = false;
  @Input() public disabled = false;

  public _errors: ValidationErrors;
  public dirty: boolean;
  public errorMessages: Map<string, () => string>;
  public inputLength = 5;
  public touched: boolean;
  public value: string;

  public constructor() {
    this.errorMessages = new Map([
      ["required", () => `${this.label} is required`],
      [
        "minLength",
        () =>
          "The time should follow the format hh:mm, e.g. 12:00, 12:30, 13:00, 13:30",
      ],
      ["delimiter", () => "Input must include a ':'"],
      ["hours", () => "Hours must be between 00 and 24"],
      ["minutes", () => "Minutes must be between 00 and 59"],
      ["afterMidnight", () => "Times after 24:00 are invalid"],
      ["invalid", () => "Invalid time selected"],
    ]);
  }

  /**
   * Invoked when the model has been changed
   */
  public onChange: (_: any) => void = () => {};

  /**
   * Invoked when the model has been touched
   */
  public onTouched: () => void = () => {};

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
   * Method that is invoked on an update of a model.
   */
  public updateChanges = () => this.onChange(this.value);

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
    return (this.dirty || this.touched) && this.errors.length > 0;
  }

  public get errors(): string[] {
    if (!this._errors) {
      return [];
    }
    return Object.keys(this._errors).map((key): string =>
      this.errorMessages.get(key)()
    );
  }

  public onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.normalizeInput(value);
  }

  public normalizeInput(value: string) {
    if (!value) {
      this.value = undefined;
      this._errors = null;
      this.onChange(this.value);
      return;
    }

    if (value.length < (this.value?.length ?? 0)) {
      this.value = value.endsWith(":") ? value.slice(0, -1) : value;
    } else {
      this.value = value;
    }

    const hasColon = this.value.includes(":");
    if (!hasColon && this.value.length >= 3) {
      this.value = this.value.slice(0, 2) + ":" + this.value.slice(2);
    }

    this._errors = this.validateInput(this.value);
    this.dirty = true;
    this.touched = true;
    this.onTouched();

    // Update model if valid input given
    if (!this._errors) {
      this.onChange(this.value);
    }
  }

  public validateInput(value: string): ValidationErrors | null {
    if (!value) {
      // No value provided on required input
      return this.required ? { required: true } : null;
    } else if (value.length < this.inputLength) {
      // Validate length of input
      return { minLength: true };
    } else if (!value.includes(":")) {
      // Validate value includes a colon
      return { delimiter: true };
    } else if (!/^(([0-1]\d)|2[0-4]):/.test(value)) {
      // Validate hours are between 00 - 24
      return { hours: true };
    } else if (!/(:[0-5]\d)$/.test(value)) {
      // Validate minutes are between 00 - 59
      return { minutes: true };
    } else if (value.startsWith("24") && !value.endsWith("00")) {
      // Validate that only 24:00 is valid
      return { afterMidnight: true };
    } else {
      // Validate time is valid
      const date = DateTime.fromFormat(value, "HH:mm");
      return date.isValid ? null : { invalid: true };
    }
  }
}
