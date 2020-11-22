import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'baw-checkbox',
  template: `
    <div [ngClass]="{ 'mx-auto': isCentered }" style="width: 24px;">
      <div class="custom-control custom-checkbox">
        <input
          type="checkbox"
          class="custom-control-input"
          [id]="id + '-checkbox'"
          [checked]="checked"
          [disabled]="disabled"
        />
        <label class="custom-control-label" for="checkbox"></label>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxComponent implements OnInit {
  @Input() public id: string;
  @Input() public checked: boolean;
  @Input() public disabled: boolean;
  @Input() public isCentered = true;

  constructor() {}

  public ngOnInit(): void {}
}
