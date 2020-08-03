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
}

// TODO Remove btn- from type, this also be a generic bootstrap class type that is reusable
type ButtonClassTypes =
  | "btn-danger"
  | "btn-success"
  | "btn-warning"
  | "btn-primary"
  | "btn-secondary"
  | "btn-info";
