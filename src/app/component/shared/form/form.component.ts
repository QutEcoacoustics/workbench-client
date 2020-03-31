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
import { WithUnsubscribe } from "src/app/helpers/unsubscribe/unsubscribe";
import { AbstractModel } from "src/app/models/AbstractModel";

/**
 * Formly Form Wrapper
 */
@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.scss"],
  // tslint:disable-next-line: use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None
})
export class FormComponent extends WithUnsubscribe() implements OnInit {
  @Input() btnColor: ButtonClassTypes = "btn-success";
  @Input() fields: FormlyFieldConfig[];
  @Input() fieldsUrl: string;
  @Input() model: AbstractModel;
  @Input() noSubmit: boolean;
  @Input() size: "small" | "default" = "default";
  @Input() submitLabel = "Submit";
  @Input() submitLoading: boolean;
  @Input() subTitle: string;
  @Input() title: string;

  // Rename is required to stop formly from hijacking the variable
  // tslint:disable-next-line: no-output-rename
  @Output("onSubmit") submitFunction: EventEmitter<any> = new EventEmitter();

  public form: FormGroup;

  constructor(private notifications: ToastrService) {
    super();
  }

  ngOnInit() {
    this.form = new FormGroup({});

    if (this.fieldsUrl) {
      // TODO Retrieve Schema from url
      // this.convertFunctions(this.fields);
    } else {
      this.fields = this.convertFunctions(this.fields);
    }
  }

  /**
   * Convert any validator functions to Function datatype.
   * This allows us to follow the format given by formly whilst also staying
   * within the limitations of JSON (eg. Cannot transmit functions).
   * @param fields Form fields
   */
  convertFunctions(fields: any) {
    if (!fields) {
      return [];
    }

    fields.forEach((field: any) => {
      const validator = field.validators;

      if (typeof validator?.fieldMatch?.expression === "string") {
        validator.fieldMatch.expression = new Function(
          "control",
          validator.fieldMatch.expression
        );
      }
    });

    return fields;
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

type ButtonClassTypes =
  | "btn-danger"
  | "btn-success"
  | "btn-warning"
  | "btn-primary"
  | "btn-secondary"
  | "btn-info";
