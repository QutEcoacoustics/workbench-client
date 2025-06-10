import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from "@angular/core";
import { DebouncedInputDirective } from "@directives/debouncedInput/debounced-input.directive";

@Component({
  selector: "baw-percentage-input",
  templateUrl: "./percentage-input.component.html",
  imports: [DebouncedInputDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PercentageInputComponent {
  public valueChange = output<number>();
  public value = input<number>();
  public label = input<string>();

  protected error = signal<string | null>(null);

  protected updateValue(stringValue: string) {
    const value = Number(stringValue);
    if (isNaN(value)) {
      this.error.set(`Incorrect data type, expected "number" found "${stringValue}"`);
    } else if (value > 1) {
      this.error.set("Number must be less than 1");
    } else if (value < 0) {
      this.error.set("Number must be greater than 0");
    } else {
      this.error.set(null);
      this.valueChange.emit(value);
    }
  }
}
