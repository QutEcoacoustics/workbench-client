import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { FieldType } from "@ngx-formly/core";

/**
 * Formly Question Answer Action
 * Displays a question, input, and button inline allowing a user to
 * execute a command for a single input.
 */
@Component({
  // tslint:disable-next-line: component-selector
  selector: "formly-question-answer",
  template: `
    <div class="form-group">
      <label *ngIf="field.templateOptions.label" [for]="field.id">
        {{ field.templateOptions.label }}
      </label>

      <div class="row fill">
        <div class="input-group col-sm-9">
          <input
            type="text"
            readonly
            class="form-control"
            [id]="field.id"
            [value]="model[key].value"
          />
        </div>

        <div class="col-sm-3 pl-3 pl-sm-0 pr-3">
          <button
            type="button"
            class="btn btn-primary w-100"
            (click)="model[key].action()"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  `
})
// tslint:disable-next-line: component-class-suffix
export class FormlyQuestionAnswerAction extends FieldType {
  formControl: FormControl;
}
