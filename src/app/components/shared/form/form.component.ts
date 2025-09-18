import {
  Component,
  Input,
  OnChanges,
  ViewEncapsulation,
  output
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
  public readonly submit = output<any>({ alias: 'onSubmit' });
  public readonly modelChange = output<any>();

  public form = new FormGroup({});

  public constructor(
    private notifications: ToastService,
    private recaptcha: ReCaptchaV3Service
  ) {
    super();
  }

  public ngOnChanges() {
    if (!isInstantiated(this.recaptchaSeed)) {
      return;
    }

    // Submit button should be inactive while retrieving recaptcha seed
    this.submitLoading = this.recaptchaSeed.state === "loading";
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
    this.modelChange.emit($event);
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
