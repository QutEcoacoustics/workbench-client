import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { BawSessionService } from "@baw-api/baw-session.service";
import { BootstrapColorTypes } from "@helpers/bootstrapTypes";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { ReCaptchaV3Service } from "ngx-captcha";
import { ToastrService } from "ngx-toastr";

export type SchemaConfig = FormlyFieldConfig & {
  adminOnly?: boolean;
  ownerOnly?: boolean;
  renderFieldOnly?: boolean;
};

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
export class FormComponent extends withUnsubscribe() implements OnChanges {
  @Input() public btnColor: BootstrapColorTypes = "primary";
  @Input() public fields: SchemaConfig[] = [];
  @Input() public model: Record<string, any> = {};
  @Input() public size: "small" | "default" = "default";
  @Input() public submitLabel = "Submit";
  @Input() public submitLoading: boolean;
  @Input() public subTitle?: string;
  @Input() public title?: string;
  @Input() public isOwner?: boolean;
  /**
   * Recaptcha seed. If set, form will be disabled until recaptcha
   * seed is loaded
   */
  @Input() public recaptchaSeed?: RecaptchaState;

  // Rename is required to stop formly from hijacking the variable
  // eslint-disable-next-line @angular-eslint/no-output-rename, @angular-eslint/no-output-on-prefix, @angular-eslint/no-output-native
  @Output("onSubmit") public submit = new EventEmitter<any>();
  @Output() public modelChange = new EventEmitter<any>();

  public form = new FormGroup({});
  public formFields: SchemaConfig[];

  public constructor(
    private notifications: ToastrService,
    private session: BawSessionService,
    private recaptcha: ReCaptchaV3Service
  ) {
    super();
  }

  public ngOnChanges(): void {
    // Filter out fields which fail their checks
    this.formFields = this.fields.filter((field): boolean => {
      if (field.renderFieldOnly) {
        return false;
      } else if (field.adminOnly && !this.session.loggedInUser?.isAdmin) {
        return false;
      } else if (field.ownerOnly && !this.isOwner) {
        return false;
      }
      return true;
    });

    if (isInstantiated(this.recaptchaSeed)) {
      // Submit button should be inactive while retrieving recaptcha seed
      this.submitLoading = this.recaptchaSeed.state === "loading";
    }
  }

  /**
   * Check form submission is valid, and if so emit output event
   *
   * @param model Form response
   */
  public async onSubmit(model: any) {
    if (this.form.status !== "VALID") {
      this.notifications.error("Please fill all required fields.");
      return;
    }

    if (!this.recaptchaSeed) {
      return this.submit.emit(model);
    }

    try {
      const { seed, action } = this.recaptchaSeed as RecaptchaLoadedState;
      const token = await this.recaptcha.executeAsPromise(seed, action);
      return this.submit.emit({ ...model, recaptchaToken: token });
    } catch (err) {
      console.error(err);
      this.notifications.error(
        "Recaptcha failed, please try refreshing the website."
      );
    }
  }

  public onModelChange($event): void {
    this.modelChange.next($event);
  }
}

interface RecaptchaLoadingState {
  state: "loading";
}
interface RecaptchaLoadedState {
  state: "loaded";
  seed: string;
  action: string;
}
export type RecaptchaState = RecaptchaLoadedState | RecaptchaLoadingState;
export type RecaptchaStatus = "success" | "error";
