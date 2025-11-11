import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BootstrapColorTypes } from "@helpers/bootstrapTypes";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { FormlyFieldConfig, FormlyModule } from "@ngx-formly/core";
import { ReCaptchaV3Service } from "ngx-captcha";
import { ToastService } from "@services/toasts/toasts.service";
import { NgClass } from "@angular/common";

/**
 * Formly Form Wrapper
 */
@Component({
  selector: "baw-form",
  templateUrl: "./form.component.html",
  styleUrl: "./form.component.scss",
  // eslint-disable-next-line @angular-eslint/use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
  imports: [NgClass, FormsModule, ReactiveFormsModule, FormlyModule],
})
export class FormComponent extends withUnsubscribe() implements OnChanges {
  private readonly notifications = inject(ToastService);
  private readonly recaptcha = inject(ReCaptchaV3Service);

  @Input() public btnColor: BootstrapColorTypes = "primary";
  @Input() public fields: FormlyFieldConfig[] = [];
  @Input() public model: Record<string, any> = {};
  @Input() public size: "small" | "default" = "default";
  @Input() public submitLabel = "Submit";
  @Input() public submitLoading: boolean;
  @Input() public subTitle?: string;
  @Input() public title?: string;
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

  public ngOnChanges() {
    // Submit button should be inactive while retrieving recaptcha seed
    if (
      isInstantiated(this.recaptchaSeed) &&
      this.recaptchaSeed.state === "loading"
    ) {
      this.submitLoading = true;
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
      // While we are fetching the recaptcha token, we want to enter the
      // "submitting" state so that the submission button is disabled.
      // If we did not do this, the submit button would be enabled while we are
      // waiting for the recaptcha token and would only become disabled once the
      // "submit" event is being processed by the parent component.
      this.submitLoading = true;

      const { seed, action } = this.recaptchaSeed as RecaptchaLoadedState;
      const token = await this.recaptcha.executeAsPromise(seed, action);
      return this.submit.emit({ ...model, recaptchaToken: token });
    } catch (err) {
      // If the recaptcha fails, we want to re-enable the submit button to allow
      // the user to try submitting the form again.
      // I do this as the first side effect (before logging to the console or
      // showing a notification) as a defensive programming measure so that even
      // if the notification or logging fails, the form will still be in a
      // usable state.
      this.submitLoading = false;

      console.error(err);
      this.notifications.error(
        "Recaptcha failed, please try refreshing the website.",
      );
    }
  }

  public onModelChange($event): void {
    this.modelChange.next($event);
  }
}

export type RecaptchaState = RecaptchaLoadedState | RecaptchaLoadingState;
export type RecaptchaStatus = "success" | "error";

interface RecaptchaLoadingState {
  state: "loading";
}

interface RecaptchaLoadedState {
  state: "loaded";
  seed: string;
  action: string;
}
