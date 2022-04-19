import { Component, Input, Optional, Self } from "@angular/core";
import {
  AbstractControl,
  ControlValueAccessor,
  NgControl,
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
    <div class="input-group has-validation">
      <span class="input-group-text">{{ label }}</span>
      <input
        class="form-control"
        placeholder="hh:mm"
        [maxLength]="inputLength"
        [class.is-valid]="touched && !showError"
        [class.is-invalid]="touched && showError"
        [required]="required"
        [disabled]="disabled"
        [value]="value"
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

  public errorMessages: Map<string, () => string>;
  public dirty: boolean;
  public touched: boolean;
  public _errors: ValidationErrors;

  public inputLength = 5;
  public value = "";

  public constructor(@Self() @Optional() public control: NgControl) {
    if (this.control) {
      this.control.valueAccessor = this;
    }
    this.errorMessages = new Map([
      ["required", () => `${this.label} is required`],
      [
        "minLength",
        () =>
          `The number of characters should not be less than ${this.inputLength}`,
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
  public onChange = (value: string): void => {
    if (value.length < this.value.length) {
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
    this.onTouched();
  };

  /**
   * Invoked when the model has been touched
   */
  public onTouched: () => void = (): boolean => (this.touched = true);

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
    this.onChange(value);
  }

  public validateInput(value: string): ValidationErrors | null {
    if (!value && !this.required) {
      // No value provided
      return { required: true };
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
