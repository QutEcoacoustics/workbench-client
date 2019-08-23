import { HttpClient } from "@angular/common/http";
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig } from "@ngx-formly/core";

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.scss"],
  // tslint:disable-next-line: use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None
})
export class FormComponent implements OnInit {
  @Input() schema: {
    model: {};
    fields: FormlyFieldConfig[];
  };
  @Input() schemaUrl: string;
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
    this.form = new FormGroup({});

    // If schema
    if (this.schema) {
      this.convertFunctions(this.schema.fields);

      this.model = this.schema.model;
      this.fields = this.schema.fields;
    } else if (this.schemaUrl) {
      this.http.get(this.schemaUrl).subscribe((data: any) => {
        this.convertFunctions(data.fields);

        this.model = data.model;
        this.fields = data.fields;
      });
    }
  }

  /**
   * Convert any validator functions to Function datatype.
   * This allows us to follow the format given by formly whilst also staying
   * within the limitations of JSON (eg. Cannot transmit functions).
   * @param fields Form fields
   */
  convertFunctions(fields: any) {
    fields.forEach(field => {
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
