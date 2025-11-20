import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  output,
  signal,
} from "@angular/core";
import { ControlValueAccessor, FormsModule } from "@angular/forms";
import { toNumber } from "@helpers/typing/toNumber";

@Component({
  selector: "baw-range",
  templateUrl: "./range.component.html",
  styleUrl: "./range.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
})
export class RangeComponent implements ControlValueAccessor, OnInit {
  public readonly label = input("");
  public readonly min = input(0);
  public readonly max = input(100);
  public readonly step = input(5);
  public readonly dirty = input(false);
  public readonly value = input<number | undefined>();

  // We have an internal value because you cannot write directly to inputs.
  // This signal is used to sync the range and number inputs.
  protected readonly _value = signal<number>(0);
  protected readonly disabled = signal(false);

  private onChange: (value: number | null) => void;
  private onTouched: () => void;

  // We want to output the "input" event so that this component can be used as
  // a direct replacement for the input:range element.
  // By emitting the "input" event, we can also seamlessly use this component
  // with directives that attach to input elements e.g. the "bawDebouncedInput"
  // directive.
  //
  // eslint-disable-next-line @angular-eslint/no-output-native
  public input = output<number>();

  public ngOnInit(): void {
    const initialValue = this.value() ?? 0;
    this._value.set(initialValue);
  }

  public writeValue(value: any): void {
    this._value.set(value);
    this.onChange?.(this.value());
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected updateValue(event: Event) {
    const stringValue = (event.target as HTMLInputElement).value;

    // I purposely don't handle the "null" case here, so that the value can be
    // "null" if the user inputs an invalid value into the number input.
    const value = toNumber(stringValue);

    this.writeValue(value);
    this.input.emit(value);
  }
}
