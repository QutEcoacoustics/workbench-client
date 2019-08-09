import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig } from "@ngx-formly/core";

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.scss"]
})
export class FormComponent implements OnInit {
  @Input() schema: string;
  @Input() title?: string;
  @Input() submitLabel: string;
  @Input() submitLoading: boolean;
  @Input() error?: string;

  // Rename is required to stop formly from hijacking the variable
  // tslint:disable-next-line: no-output-rename
  @Output("onSubmit") submitFunction: EventEmitter<any> = new EventEmitter();

  form: FormGroup;
  fields: FormlyFieldConfig[];
  model: {};

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.submitLoading = false;
    this.form = new FormGroup({});
    this.http.get(this.schema).subscribe((data: any) => {
      /**
       * Convert any validator functions to Function datatype.
       * This allows us to follow the format given by formly whilst also staying
       * within the limitations of JSON (eg. Cannot transmit functions).
       */
      data.fields.forEach(field => {
        const validator = field.validators;

        if (
          validator &&
          validator.fieldMatch &&
          validator.fieldMatch.expression
        ) {
          validator.fieldMatch.expression = new Function(
            "control",
            validator.fieldMatch.expression
          );
        }
      });

      this.model = data.model;
      this.fields = data.fields;
    });
  }

  /**
   * Clear form error
   */
  clearError() {
    this.error = null;
  }

  /**
   * Check form submission is valid, and if so emit output event
   * @param model Form response
   */
  submit(model: any) {
    if (this.form.status === "VALID") {
      this.submitFunction.emit(model);
    } else {
      this.error = "Please fill all required fields.";
    }
  }
}
