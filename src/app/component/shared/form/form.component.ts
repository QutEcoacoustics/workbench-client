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
import { ToastrService } from "ngx-toastr";
import { takeUntil } from "rxjs/operators";
import { WithUnsubscribe } from "src/app/helpers/unsubscribe/unsubscribe";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { ApiResponse } from "src/app/services/baw-api/baw-api.service";

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.scss"],
  // tslint:disable-next-line: use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None
})
export class FormComponent extends WithUnsubscribe() implements OnInit {
  @Input() btnColor:
    | "btn-danger"
    | "btn-success"
    | "btn-warning"
    | "btn-primary"
    | "btn-secondary"
    | "btn-info" = "btn-success";
  /**
   * Deprecated
   */
  @Input() error?: string;
  @Input() schema: {
    model: {};
    fields: FormlyFieldConfig[];
  };
  @Input() schemaUrl: string;
  @Input() submitLabel: string;
  @Input() submitLoading: boolean;
  @Input() subTitle?: string;
  /**
   * Deprecated
   */
  @Input() success?: string;
  @Input() size: "small" | "default" = "default";
  @Input() title?: string;

  // Rename is required to stop formly from hijacking the variable
  // tslint:disable-next-line: no-output-rename
  @Output("onSubmit") submitFunction: EventEmitter<any> = new EventEmitter();

  form: FormGroup;
  fields: FormlyFieldConfig[];
  model: {};

  constructor(private http: HttpClient, private notifications: ToastrService) {
    super();
  }

  ngOnInit() {
    this.form = new FormGroup({});

    // If schema
    if (this.schema) {
      this.convertFunctions(this.schema.fields);

      this.model = this.schema.model;
      this.fields = this.schema.fields;
    } else if (this.schemaUrl) {
      // TODO Wrap this in service to better handle remote forms
      this.http
        .get(this.schemaUrl)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          (response: ApiResponse<any>) => {
            this.convertFunctions(response.data.fields);

            this.model = response.data.model;
            this.fields = response.data.fields;
          },
          (err: ApiErrorDetails) => {
            this.notifications.error(err.message);
          }
        );
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

      if (typeof validator?.fieldMatch?.expression === "string") {
        validator.fieldMatch.expression = new Function(
          "control",
          validator.fieldMatch.expression
        );
      }
    });
  }

  /**
   * Check form submission is valid, and if so emit output event
   * @param model Form response
   */
  submit(model: any) {
    if (this.form.status === "VALID") {
      this.submitFunction.emit(this.flattenFields(model));
    } else {
      this.notifications.error("Please fill all required fields.");
    }
  }

  /**
   * Used to flatten formly model field groups into an object with 1 depth
   * @param model Formly model output
   */
  flattenFields(model: any): any {
    let output = {};

    if (!model) {
      return output;
    }

    for (const key of Object.keys(model)) {
      if (typeof model[key] === "string" || typeof model[key] === "number") {
        output[key] = model[key];
      } else {
        output = { ...output, ...this.flattenFields(model[key]) };
      }
    }

    return output;
  }
}
