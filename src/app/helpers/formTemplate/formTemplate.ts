import { OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { WithFormCheck } from "src/app/guards/form/form.guard";
import { AbstractModel } from "src/app/models/AbstractModel";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import {
  ResolvedModelList,
  retrieveResolvers,
} from "src/app/services/baw-api/resolver-common";
import { PageComponent } from "../page/pageComponent";
import { PageInfo } from "../page/pageInfo";

export abstract class FormTemplate<M extends AbstractModel>
  extends WithFormCheck(PageComponent)
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
  public model: M;
  /**
   * Extra models stored in data
   */
  public models: ResolvedModelList = {};
  /**
   * Formly fields
   */
  public fields: FormlyFieldConfig[] = [];
  /**
   * Success Message
   */
  private successMessage: string;

  /**
   * Customize form template
   * @param notifications Notifications service
   * @param route Activated route service
   * @param router Router service
   * @param modelKey Primary model resolver key
   * @param successMsg Success message
   * @param errorMsg Error message
   */
  constructor(
    protected notifications: ToastrService,
    protected route: ActivatedRoute,
    protected router: Router,
    private modelKey: string,
    private successMsg: (model: M) => string = (model) =>
      defaultSuccessMsg("updated", model.id.toString()),
    private errorMsg: (err: ApiErrorDetails) => string = defaultErrorMsg,
    private hasFormCheck = true
  ) {
    super();
  }

  ngOnInit() {
    // Override form checking
    if (!this.hasFormCheck) {
      this.isFormTouched = () => {
        return false;
      };

      this.resetForms = () => {};
    }

    // Retrieve models from router
    const data = this.route.snapshot.data as PageInfo;

    // If no resolvers, return early
    if (!data.resolvers) {
      return;
    }

    // Retrieve models
    const resolvedModels = retrieveResolvers(data);
    if (!resolvedModels) {
      this.failure = true;
      return;
    }
    this.models = resolvedModels;

    // Find primary model
    this.model = this.models[this.modelKey] as M;

    if (!this.modelKey) {
      this.model = {} as M;
    } else if (!this.model) {
      // Model wasn't found, return failure
      this.failure = true;
      return;
    }

    /*
    First pass attempt a generating success message. This is required
    for forms which will modify the model later without changing the
    success message (ie. update/delete form).
    */
    if (this.model.kind) {
      this.successMessage = this.successMsg(this.model);
    }
  }

  /**
   * Form submit handler
   * @param event Form submission
   */
  public submit(event: Partial<M>) {
    this.loading = true;

    this.apiAction(event)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (model: M) => {
          /*
          First pass attempt a generating success message. This is required
          for forms which do not initially have a model (ie. new model form).
          */
          if (!this.successMessage) {
            this.successMessage = this.successMsg(model);
          }

          this.resetForms();
          this.loading = false;
          this.notifications.success(this.successMessage);
          this.redirectUser(model);
        },
        (err: ApiErrorDetails) => {
          this.loading = false;
          this.notifications.error(this.errorMsg(err));
        }
      );
  }

  /**
   * Redirect user after successful submission
   * @param model Model
   */
  protected redirectUser(model: M): void {
    this.router.navigateByUrl(this.redirectionPath(model));
  }

  /**
   * Redirection path after successful submission
   * @param model Model
   */
  protected redirectionPath(model: M): string {
    return model.viewUrl;
  }

  /**
   * API Action to perform
   * @param model Form model submission (JSON only, convert to model)
   */
  protected abstract apiAction(model: Partial<M>): Observable<M | void>;
}

/**
 * Default success message on form submission
 * @param name Model name
 */
export function defaultSuccessMsg(
  action: "created" | "updated" | "destroyed",
  name: string
) {
  return `Successfully ${action} ${name}`;
}

/**
 * Default error message on form submission
 * @param err API error details
 */
export function defaultErrorMsg(err: ApiErrorDetails): string {
  return err.message;
}

/**
 * Error message on form submission with additional information
 * @param err API error details
 * @param info API error info handlers
 */
export function extendedErrorMsg(
  err: ApiErrorDetails,
  info: { [key: string]: (value: any) => string }
): string {
  let errMsg = err.message;

  if (!err.info) {
    return errMsg;
  }

  // Handle additional error details
  for (const key of Object.keys(err.info)) {
    if (info[key]) {
      errMsg = errMsg + "<br />" + info[key](err.info[key]);
    }
  }
  return errMsg;
}
