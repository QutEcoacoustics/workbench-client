import { Directive } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

/**
 * File Value Accessor
 * Grabs the files from a file input and sets them as the value of the
 * input.
 */
@Directive({
  // eslint-disable-next-line
  selector: "input[type=file]",
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    "(change)": "onChange($event.target.files)",
    "(blur)": "onTouched()",
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: FileValueAccessor, multi: true },
  ],
})
// https://github.com/angular/angular/issues/7341
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class FileValueAccessor implements ControlValueAccessor {
  public value: any;
  public onChange = (_) => {};
  public onTouched = () => {};

  public writeValue(value) {}
  public registerOnChange(fn: any) {
    this.onChange = fn;
  }
  public registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
}
