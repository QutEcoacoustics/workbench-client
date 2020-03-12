import { OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { WithFormCheck } from "src/app/guards/form/form.guard";
import { AbstractModel } from "src/app/models/AbstractModel";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { ResolvedModel } from "src/app/services/baw-api/resolver-common";
import { PageComponent } from "../page/pageComponent";

export abstract class FormTemplate<M extends AbstractModel, F>
  extends WithFormCheck(PageComponent)
  implements OnInit {
  public loading: boolean;
  public models: { [key: string]: AbstractModel };
  public schema: FormlySchema;

  /**
   * @param modelKeys Model resolver keys
   * @param api API Service
   * @param notifications ToastrService
   * @param route ActivatedRoute
   * @param router Router
   */
  constructor(
    protected modelKeys: string[],
    protected fields: any[],
    protected notifications: ToastrService,
    protected route: ActivatedRoute,
    protected router: Router
  ) {
    super();
  }

  ngOnInit() {
    // Grab models from route data
    const data = this.route.snapshot.data;
    const resolvedModels: ResolvedModel<AbstractModel>[] = this.modelKeys.map(
      key => data[key]
    );

    // If any models failed, return
    if (resolvedModels.some(resolvedModel => resolvedModel.error)) {
      return;
    }

    // Add models to object
    this.models = {};
    resolvedModels.forEach((resolvedModel, index) => {
      this.models[this.modelKeys[index]] = resolvedModel.model;
    });

    // Create form schema
    this.schema = { model: {}, fields: this.fields };
  }

  /**
   * Create api request. This should be overwritten by superclass.
   */
  protected abstract apiAction($event: F): Observable<M | void>;

  /**
   * Success message
   */
  protected abstract successMessage(model: M): string;

  /**
   * Redirect path on successful update
   */
  protected abstract redirectPath(model: M): string;

  /**
   * Handle successful api response
   * @param model Abstract Model
   */
  protected apiSuccess = (model: M) => {
    this.resetForms();
    this.loading = false;
    this.notifications.success(this.successMessage(model));
    this.router.navigateByUrl(this.redirectPath(model));
  };

  /**
   * Handle failed api response
   * @param err Api Error Details
   */
  protected apiError = (err: ApiErrorDetails) => {
    let errMsg: string;

    // Handle additional error details
    if (err.info && err.info.name && err.info.name.length === 1) {
      errMsg = err.message + ": name " + err.info.name[0];
    } else {
      errMsg = err.message;
    }

    this.loading = false;
    this.notifications.error(errMsg);
  };

  /**
   * Handle form submission
   * @param $event Form Submission
   */
  public submit(event: F) {
    this.loading = true;

    this.apiAction(event)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(this.apiSuccess, this.apiError);
  }
}

export interface FormlySchema {
  model: {};
  fields: any[];
}
