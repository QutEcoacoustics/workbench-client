import { Directive } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

/**
 * File Value Accessor
 * Grabs the files from a file input and sets them as the value of the
 * input.
 */
@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
  selector: "input[type=file]",
  host: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      "(change)": "onChange($event.target.files)",
      // eslint-disable-next-line @typescript-eslint/naming-convention
      "(blur)": "onTouched()",
  },
  providers: [
      {
          provide: NG_VALUE_ACCESSOR,
          useExisting: FileValueAccessorDirective,
          multi: true,
      },
  ],
  standalone: false
})
// https://github.com/angular/angular/issues/7341
export class FileValueAccessorDirective implements ControlValueAccessor {
  public value: any;
  public onChange = () => {};
  public onTouched = () => {};

  public writeValue() {}
  public registerOnChange(fn: any) {
    this.onChange = fn;
  }
  public registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
}
