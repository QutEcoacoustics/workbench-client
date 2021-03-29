import { Directive, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { ResolvedModelList, retrieveResolvers } from "@baw-api/resolver-common";
import { withFormCheck } from "@guards/form/form.guard";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { RecaptchaState } from "@shared/form/form.component";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { PageComponent } from "../page/pageComponent";
import { PageInfo } from "../page/pageInfo";
import { defaultErrorMsg, defaultSuccessMsg } from "./formTemplate";

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class SimpleFormTemplate<Model>
  extends withFormCheck(PageComponent)
  implements OnInit {
  /**
   * Form Submission Function Loading
   */
  public loading: boolean;
  /**
   * Initial setup failed
   */
  public failure: boolean;
  /**
   * Model to edit using form
   */
  public model: Model;
  /**
   * Extra models stored in data
   */
  public models: ResolvedModelList = {};
  /**
   * Formly fields
   */
  public fields: FormlyFieldConfig[] = [];
  /**
   * Recaptcha state tracker, undefined if not used
   */
  public recaptchaSeed: RecaptchaState;
  /**
   * Success Message
   */
  private successMessage: string;

  /**
   * Customize form template
   *
   * @param notifications Notifications service
   * @param route Activated route service
   * @param router Router service
   * @param modelKey Primary model resolver key
   * @param successMsg Success message
   * @param errorMsg Error message
   */
  public constructor(
    protected notifications: ToastrService,
    protected route: ActivatedRoute,
    protected router: Router,
    private successMsg: (model: Model | void) => string = () =>
      defaultSuccessMsg("updated", "model"),
    private errorMsg: (err: ApiErrorDetails) => string = defaultErrorMsg,
    private hasFormCheck = true
  ) {
    super();
  }

  public ngOnInit() {
    // Override form checking
    if (!this.hasFormCheck) {
      this.isFormTouched = () => false;
      this.resetForms = () => {};
    }

    // Retrieve models from router
    const data = this.route.snapshot.data as PageInfo;

    // Retrieve models
    const models = retrieveResolvers(data);
    if (!models) {
      this.failure = true;
      return;
    }
    this.models = models;
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
      .subscribe(
        (model: Model | void) => {
          /*
           * First pass attempt a generating success message. This is required
           * for forms which do not initially have a model (ie. new model form).
           */
          this.successMessage ??= this.successMsg(model);
          this.resetForms();
          this.loading = false;
          this.notifications.success(this.successMessage);
          this.onSuccess(model);
        },
        (err: ApiErrorDetails) => {
          this.loading = false;
          this.notifications.error(this.errorMsg(err));
        }
      );
  }

  /**
   * Function called after successful form request
   *
   * @param model API response
   */
  protected abstract onSuccess(model: Model | void): void;

  /**
   * API Action to perform
   *
   * @param model Form model submission (JSON only, convert to model)
   */
  protected abstract apiAction(model: Partial<Model>): Observable<Model | void>;
}
