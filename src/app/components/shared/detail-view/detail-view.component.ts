import { Component, Input } from "@angular/core";
import { AbstractModel } from "@models/AbstractModel";
import { FormlyFieldConfig } from "@ngx-formly/core";

@Component({
  selector: "baw-detail-view",
  template: `
    <div *ngFor="let field of fields" class="row">
      <dt class="col-sm-3 text-start text-sm-right fw-bold">
        {{ field.templateOptions.label }}
      </dt>
      <baw-render-field
        class="col-sm-9"
        [value]="getValue(field)"
      ></baw-render-field>
    </div>
  `,
  styles: [
    `
      dt {
        margin-bottom: 1rem;
      }
    `,
  ],
})
export class DetailViewComponent {
  @Input() public fields: FormlyFieldConfig[];
  @Input() public model: AbstractModel;

  public getValue(field: FormlyFieldConfig) {
    return this.model[field.key as string];
  }
}
