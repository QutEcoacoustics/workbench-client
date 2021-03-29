import { Directive, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { AbstractModel } from "@models/AbstractModel";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import {
  defaultErrorMsg,
  defaultSuccessMsg,
  SimpleFormTemplate,
} from "./simpleFormTemplate";

/**
 * Form Template for dealing with AbstractModels. This makes the assumption that
 * the form will redirect the user after the form submission is successful.
 * WARNING: You must override the redirectionPath if the viewUrl of a model
 * is not compatible with Router.navigateByUrl (ie. If it returns a path
 * containing query parameters)
 */
@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class FormTemplate<Model extends AbstractModel>
  extends SimpleFormTemplate<Model>
  implements OnInit {
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
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router,
    protected modelKey: string,
    protected successMsg: (model: Model) => string = (model) =>
      defaultSuccessMsg("updated", model.id.toString()),
    errorMsg: (err: ApiErrorDetails) => string = defaultErrorMsg,
    hasFormCheck = true
  ) {
    super(notifications, route, router, successMsg, errorMsg, hasFormCheck);
  }

  public ngOnInit() {
    super.ngOnInit();

    if (this.failure) {
      return;
    }

    // Find primary model
    this.model = this.models[this.modelKey] as Model;

    if (!this.modelKey) {
      this.model = {} as Model;
    } else if (!this.model) {
      // Model wasn't found, return failure
      this.failure = true;
      return;
    }

    /*
     * First pass attempt a generating success message. This is required
     * for forms which will modify the model later without changing the
     * success message (ie. update/delete form).
     */
    if (isInstantiated(this.model.kind)) {
      this.successMessage = this.successMsg(this.model);
    }
  }

  protected onSuccess(model: Model): void {
    this.redirectUser(model);
  }

  /**
   * Redirect user after successful submission
   *
   * @param model Model
   */
  protected redirectUser(model: Model): void {
    /*
     * TODO This is a potential point of failure as the model.viewUrl
     * path is not completely compatible with router.navigateByUrl
     */
    this.router.navigateByUrl(this.redirectionPath(model));
  }

  /**
   * Redirection path after successful submission. If you are using
   * a models viewUrl method, ensure that it does not require query
   * parameters to function properly
   *
   * @param model Model
   */
  protected redirectionPath(model: Model): string {
    return model.viewUrl;
  }

  /**
   * API Action to perform
   *
   * @param model Form model submission (JSON only, convert to model)
   */
  protected abstract apiAction(model: Partial<Model>): Observable<Model | void>;
}
