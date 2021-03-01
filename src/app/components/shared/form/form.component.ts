import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { BootstrapColorTypes } from "@helpers/bootstrapTypes";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { NgRecaptcha3Service } from "ng-recaptcha3";
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
export class FormComponent
  extends withUnsubscribe()
  implements OnChanges, OnDestroy {
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
  private loadingSeed: boolean;

  // Rename is required to stop formly from hijacking the variable
  // eslint-disable-next-line @angular-eslint/no-output-rename
  @Output("onSubmit") public submit = new EventEmitter<any>();

  public form = new FormGroup({});

  public constructor(
    private notifications: ToastrService,
    private recaptcha: NgRecaptcha3Service
  ) {
    super();
  }

  public async ngOnChanges() {
    if (!isInstantiated(this.recaptchaSeed) || this.loadingSeed) {
      return;
    }

    if (this.recaptchaSeed.state === "loading") {
      this.submitLoading = true;
    } else if (this.recaptchaSeed.state === "loaded") {
      this.loadingSeed = true;
      const status = (await this.recaptcha.init(
        this.recaptchaSeed.seed
      )) as RecaptchaStatus;

      if (status === "error") {
        this.notifications.error("Failed to load recaptcha");
        return;
      }

      this.submitLoading = false;
    }
  }

  public ngOnDestroy() {
    this.recaptcha.destroy();
  }

  /**
   * Check form submission is valid, and if so emit output event
   *
   * @param model Form response
   */
  public async onSubmit(model: any) {
    if (this.form.status === "VALID") {
      return this.submit.emit(
        this.recaptchaSeed
          ? { ...model, recaptchaToken: await this.recaptcha.getToken() }
          : model
      );
    } else {
      this.notifications.error("Please fill all required fields.");
    }
  }
}

interface RecaptchaLoadingState {
  state: "loading";
}
interface RecaptchaLoadedState {
  state: "loaded";
  seed: string;
}
export type RecaptchaState = RecaptchaLoadedState | RecaptchaLoadingState;
export type RecaptchaStatus = "success" | "error";
