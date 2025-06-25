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
  public label = input("");
  public min = input(0);
  public max = input(100);
  public step = input(5);
  public value = input<number | null>(0);

  protected disabled = signal(false);
  protected internalValue = signal<number>(0);

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
    this.internalValue.set(this.value());
  }

  public writeValue(value: any): void {
    this.internalValue.set(value);
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
    const value = toNumber(stringValue);

    this.writeValue(value);
    this.input.emit(this.value());
  }
}
