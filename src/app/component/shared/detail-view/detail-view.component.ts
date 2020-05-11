import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from "@angular/core";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { AbstractModel } from "src/app/models/AbstractModel";

@Component({
  selector: "baw-detail-view",
  template: `
    <div *ngFor="let field of sanitizedFields" class="row">
      <dt class="col-sm-3 text-left text-sm-right font-weight-bold">
        {{ field.templateOptions.label }}
      </dt>
      <baw-render-field
        class="col-sm-9"
        [view]="model[field.key]"
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailViewComponent implements OnInit {
  @Input() fields: FormlyFieldConfig[];
  @Input() model: AbstractModel;
  public sanitizedFields: FormlyFieldConfig[];

  constructor() {}

  ngOnInit(): void {
    this.sanitizedFields = [];
    this.recursiveSanitization(this.fields);
  }

  private recursiveSanitization(fields: FormlyFieldConfig[]) {
    fields?.forEach((field) => {
      if (field.fieldGroup) {
        this.recursiveSanitization(field.fieldGroup);
      } else {
        this.sanitizedFields.push(field);
      }
    });
  }
}
