import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { BootstrapColorTypes } from "@helpers/bootstrapTypes";
import { WithUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { ToastrService } from "ngx-toastr";

/**
 * Formly Form Wrapper
 */
@Component({
  selector: "baw-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.scss"],
  // eslint-disable-next-line @angular-eslint/use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
})
export class FormComponent extends WithUnsubscribe() implements OnInit {
  @Input() public btnColor: BootstrapColorTypes = "primary";
  @Input() public fields: FormlyFieldConfig[];
  @Input() public model: object = {};
  @Input() public size: "small" | "default" = "default";
  @Input() public submitLabel = "Submit";
  @Input() public submitLoading: boolean;
  @Input() public subTitle?: string;
  @Input() public title?: string;

  // Rename is required to stop formly from hijacking the variable
  // eslint-disable-next-line @angular-eslint/no-output-rename
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
