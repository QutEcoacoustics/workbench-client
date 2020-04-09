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
    <div>
      <div *ngFor="let field of fields">
        <div class="row">
          <div class="col-sm-3">
            <p class="text-left text-sm-right">
              <strong>
                {{ field.templateOptions.label }}
              </strong>
            </p>
          </div>
          <div class="col-sm-9">
            <app-render-view [view]="model[field.key]"></app-render-view>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailViewComponent implements OnInit {
  @Input() fields: FormlyFieldConfig[];
  @Input() model: AbstractModel;

  constructor() {}

  ngOnInit(): void {}
}
