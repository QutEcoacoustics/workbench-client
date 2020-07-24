import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { ToastrService } from "ngx-toastr";
import { WithUnsubscribe } from "src/app/helpers/unsubscribe/unsubscribe";

/**
 * Formly Form Wrapper
 */
@Component({
  selector: "baw-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.scss"],
  // tslint:disable-next-line: use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
})
export class FormComponent extends WithUnsubscribe() implements OnInit {
  @Input() public btnColor: ButtonClassTypes = "btn-success";
  @Input() public fields: FormlyFieldConfig[];
  @Input() public fieldsUrl: string;
  @Input() public model: object = {};
  @Input() public size: "small" | "default" = "default";
  @Input() public submitLabel = "Submit";
  @Input() public submitLoading: boolean;
  @Input() public subTitle?: string;
  @Input() public title?: string;

  // Rename is required to stop formly from hijacking the variable
  // tslint:disable-next-line: no-output-rename
  @Output("onSubmit") public submitFunction = new EventEmitter<any>();

  public form: FormGroup;

  constructor(private notifications: ToastrService) {
    super();
  }

  public ngOnInit() {
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
  public convertFunctions(fields: any) {
    fields = fields ?? [];

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
  public submit(model: any) {
    if (this.form.status === "VALID") {
      this.submitFunction.emit(model);
    } else {
      this.notifications.error("Please fill all required fields.");
    }
  }

  /**
   * @deprecated
   * Used to flatten formly model field groups into an object with 1 depth.
   * This is done by mutating the model object so that references are not
   * lost.
   * @param model Form model
   */
  public flattenFields(model: any): any {
    console.log(model);

    const fieldGroups = this.fields.filter(
      (field) => field.fieldGroup?.length > 0
    );
    for (const field of fieldGroups) {
      console.log(field);
    }
  }
}

type ButtonClassTypes =
  | "btn-danger"
  | "btn-success"
  | "btn-warning"
  | "btn-primary"
  | "btn-secondary"
  | "btn-info";
