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
  public id = input<string>();
  public disabled = input<boolean>();

  public checked = input(false);
  public checkedChange = output<boolean>();
}
