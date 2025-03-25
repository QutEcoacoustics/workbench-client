import { Directive, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  hasResolvedSuccessfully,
  ResolvedModelList,
  retrieveResolvers,
} from "@baw-api/resolver-common";
import { withFormCheck } from "@guards/form/form.guard";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { AbstractModel } from "@models/AbstractModel";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { RecaptchaState } from "@shared/form/form.component";
import { Observable } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ToastService } from "@services/toasts/toasts.service";
import { PageComponent } from "../page/pageComponent";
import { IPageInfo } from "../page/pageInfo";

export interface FormProps<Model> {
  successMsg: (model: Partial<Model>) => string;
  failureMsg?: (err: BawApiError) => string;
  onSuccess?: (model: Model | void) => void;
  redirectUser?: (model: Model) => void;
  getModel: (models: ResolvedModelList) => Partial<Model>;
  hasFormCheck?: boolean;
}
const defaultOptions: FormProps<any> = {
  successMsg: () => defaultSuccessMsg("updated", "model"),
  getModel: () => ({}),
  hasFormCheck: true,
};

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class FormTemplate<Model extends AbstractModel>
  extends withFormCheck(PageComponent)
  implements OnInit
{
  /** Form submission processing */
  public loading: boolean;
  /** Initial setup failed */
  public failure: boolean;
  /** Model to edit using form */
  public model: Partial<Model>;
  /** Extra models stored in data */
  public models: ResolvedModelList = {};
  /** Formly fields */
  public fields: FormlyFieldConfig[] = [];
  /** Recaptcha state tracker, undefined if not used */
  public recaptchaSeed: RecaptchaState;
  /** Success message */
  private successMessage: string;
  /** Form template options */
  private opts: FormProps<Model>;

  /**
   * Customize form template
   *
   * @param notifications Notifications service
   * @param route Activated route service
   * @param router Router service
   * @param opts Form template options
   */
  public constructor(
    protected notifications: ToastService,
    protected route: ActivatedRoute,
    protected router: Router,
    opts: Partial<FormProps<Model>>
  ) {
    super();
    this.opts = { ...defaultOptions, ...opts };
  }

  public ngOnInit() {
    // Override form checking
    if (!this.opts.hasFormCheck) {
      this.isFormTouched = () => false;
      this.resetForms = () => {};
    }

    // Retrieve models from router
    const data = this.route.snapshot.data as IPageInfo;

    // Retrieve models and handle potential failure
    const models = retrieveResolvers(data);
    if (!hasResolvedSuccessfully(models)) {
      this.failure = true;
      return;
    }
    this.models = models;

    // Retrieve model and handle potential failure
    this.model = this.opts.getModel(this.models);
    if (!isInstantiated(this.model)) {
      this.failure = true;
      return;
    }

    /*
     * First pass attempt a generating success message. This is required
     * for forms which will modify the model later without changing the
     * success message (ie. update/delete form).
     */
    if (this.model?.kind) {
      this.successMessage = this.opts.successMsg(this.model);
    }
  }

  /**
   * Form submit handler
   *
   * @param event Form submission
   */
  public submit(event: Partial<Model>) {
    this.loading = true;

    this.apiAction(event)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (model: Model) => {
          /*
           * First pass attempt a generating success message. This is required
           * for forms which do not initially have a model (ie. new model form).
           */
          this.successMessage ??= this.opts.successMsg(model);
          this.resetForms();
          this.loading = false;
          this.notifications.success(this.successMessage);
          this.opts.onSuccess?.(model);
          this.opts.redirectUser?.(model);
        },
        error: (err: BawApiError) => {
          console.error(err);
          this.loading = false;

          if (this.opts.failureMsg) {
            this.notifications.error(this.opts.failureMsg(err));
          }
        },
      });
  }

  /**
   * Function called after successful form request
   *
   * @param model API response
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected onSuccess(model: Model | void): void {}

  /**
   * API Action to perform
   *
   * @param model Form model submission (JSON only, convert to model)
   */
  protected abstract apiAction(model: Partial<Model>): Observable<Model | void>;
}

/**
 * Default success message on form submission
 *
 * @param name Model name
 */
export function defaultSuccessMsg(
  action: "created" | "updated" | "destroyed",
  name: string
) {
  return `Successfully ${action} ${name}`;
}
