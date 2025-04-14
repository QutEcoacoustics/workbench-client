import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { NgClass } from "@angular/common";

@Component({
  selector: "baw-checkbox",
  template: `
    <div class="checkbox-wrapper" [ngClass]="{ 'mx-auto': isCentered }">
      <div class="custom-control custom-checkbox">
        <input
          type="checkbox"
          class="custom-control-input"
          [id]="id + '-checkbox'"
          [checked]="checked"
          [disabled]="disabled"
          (change)="checkedChange.emit($any($event).target.checked)"
        />
        <label class="custom-control-label" for="checkbox"></label>
      </div>
    </div>
  `,
  styles: [`
    .checkbox-wrapper {
      width: min-content;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass]
})
export class CheckboxComponent {
  @Input() public id: string;
  @Input() public checked: boolean;
  @Input() public disabled: boolean;
  @Input() public isCentered = true;
  @Output() public checkedChange = new EventEmitter<boolean>();
}
