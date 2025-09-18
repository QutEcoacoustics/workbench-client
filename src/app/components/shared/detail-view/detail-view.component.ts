import { Component, input } from "@angular/core";
import { AbstractModel } from "@models/AbstractModel";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { RenderFieldComponent } from "./render-field/render-field.component";

@Component({
  selector: "baw-detail-view",
  template: `
    @for (field of fields(); track field) {
      <div class="row">
        <dt
          class="col-sm-3 text-start text-sm-end fw-bold"
          [innerText]="field.props.label"
        ></dt>
        <baw-render-field
          class="col-sm-9"
          [value]="getValue(field)"
        ></baw-render-field>
      </div>
    }
  `,
  styles: [`
    dt {
      margin-bottom: 1rem;
    }
  `],
  imports: [RenderFieldComponent]
})
export class DetailViewComponent {
  public readonly fields = input<FormlyFieldConfig[]>(undefined);
  public readonly model = input<AbstractModel>(undefined);

  public getValue(field: FormlyFieldConfig) {
    // because formly fields can be numbers as well as string
    // we use toString() so that we always convert the number types to a string
    return this.model()[field.key.toString()];
  }
}
