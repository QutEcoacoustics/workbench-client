import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from "@angular/core";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { AbstractModel } from "src/app/models/AbstractModel";

@Component({
  selector: "app-detail-view",
  template: `
    <dl *ngFor="let field of fields" class="row">
      <dt class="col-sm-3 text-left text-sm-right font-weight-bold">
        {{ field.templateOptions.label }}
      </dt>
      <app-render-view
        class="col-sm-9"
        [view]="model[field.key]"
      ></app-render-view>
    </dl>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailViewComponent implements OnInit {
  @Input() fields: FormlyFieldConfig[];
  @Input() model: AbstractModel;

  constructor() {}

  ngOnInit(): void {}
}
