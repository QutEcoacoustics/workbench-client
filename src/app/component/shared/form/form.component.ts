import { HttpClient } from "@angular/common/http";
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor";

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.scss"],
  // tslint:disable-next-line: use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None
})
export class FormComponent implements OnInit, OnDestroy {
  @Input() schema: {
    model: {};
    fields: FormlyFieldConfig[];
  };
  @Input() schemaUrl: string;
  @Input() title?: string;
  @Input() subTitle?: string;
  @Input() submitLabel: string;
  @Input() submitLoading: boolean;
  @Input() error?: string;
  @Input() success?: string;
  @Input() btnColor?:
    | "btn-danger"
    | "btn-success"
    | "btn-warning"
    | "btn-primary"
    | "btn-secondary"
    | "btn-info" = "btn-success";

  // Rename is required to stop formly from hijacking the variable
  // tslint:disable-next-line: no-output-rename
  @Output("onSubmit") submitFunction: EventEmitter<any> = new EventEmitter();

  private unsubscribe = new Subject();
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
      this.http
        .get(this.schemaUrl)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          (data: any) => {
            this.convertFunctions(data.fields);

            this.model = data.model;
            this.fields = data.fields;
          },
          (err: ApiErrorDetails) => {
            this.error = err.message;
          }
        );
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
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

      if (typeof validator?.fieldMatch?.expression === "string") {
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
   * Clear form success
   */
  clearSuccess() {
    this.success = null;
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

/**
 * Used to flatten formly model field groups into an object with 1 depth
 * @param model Formly model output
 */
export function flattenFields(model: any): any {
  let output = {};

  for (const key of Object.keys(model)) {
    if (typeof model[key] === "string" || typeof model[key] === "number") {
      output[key] = model[key];
    } else {
      output = { ...output, ...flattenFields(model[key]) };
    }
  }

  return output;
}
