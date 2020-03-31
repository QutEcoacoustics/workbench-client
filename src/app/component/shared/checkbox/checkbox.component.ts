import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from "@angular/core";

@Component({
  selector: "app-checkbox",
  template: `
    <div class="mx-auto" style="width: 24px;">
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxComponent implements OnInit {
  @Input() id: string;
  @Input() checked: boolean;
  @Input() disabled: boolean;

  constructor() {}

  ngOnInit(): void {}
}
