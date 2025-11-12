import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";

@Component({
  selector: "baw-checkbox",
  template: `
    <div class="checkbox-wrapper">
      <div class="custom-control custom-checkbox">
        <input
          type="checkbox"
          class="custom-control-input"
          [id]="id() + '-checkbox'"
          [disabled]="disabled()"
          [checked]="checked()"
          (input)="checkedChange.emit($any($event.target).checked)"
        />
        <label class="custom-control-label" for="checkbox"></label>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }

      .checkbox-wrapper {
        width: min-content;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxComponent {
  public readonly id = input<string>();
  public readonly disabled = input<boolean>();

  public readonly checked = input(false);
  public readonly checkedChange = output<boolean>();
}
