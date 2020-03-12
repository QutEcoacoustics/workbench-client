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

/**
 * Edit Abstract Model Form
 */
export abstract class EditFormTemplate<M extends AbstractModel, F>
  extends WithFormCheck(PageComponent)
  implements OnInit {
  public loading: boolean;
  public models: { [key: string]: AbstractModel };
  public schema: FormlySchema;

  /**
   * @param modelName Model name
   * @param modelKeys Model resolver keys
   * @param api API Service
   * @param notifications ToastrService
   * @param route ActivatedRoute
   * @param router Router
   */
  constructor(
    private modelName: string,
    private modelKeys: string[],
    private fields: any[],
    private notifications: ToastrService,
    private route: ActivatedRoute,
    private router: Router
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

    // Update form schema
    this.schema = { model: {}, fields: this.fields };
    this.preFillForm();
  }

  /**
   * Pre-fill form schema with changes
   */
  protected abstract preFillForm(): void;

  /**
   * Create update command
   */
  protected abstract apiUpdate($event: F): Observable<M>;

  /**
   * Redirect path on successful update
   */
  protected abstract redirectPath(model: M): string;

  /**
   * Handle form submission
   * @param $event Form Submission
   */
  public submit(event: F) {
    this.loading = true;

    this.apiUpdate(event)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (model: M) => {
          this.resetForms();
          this.loading = false;
          this.notifications.success(
            this.modelName + " was successfully updated."
          );
          this.router.navigateByUrl(this.redirectPath(model));
        },
        (err: ApiErrorDetails) => {
          let errMsg: string;

          // Handle additional error details
          if (err.info && err.info.name && err.info.name.length === 1) {
            errMsg = err.message + ": name " + err.info.name[0];
          } else {
            errMsg = err.message;
          }

          this.loading = false;
          this.notifications.error(errMsg);
        }
      );
  }
}

interface FormlySchema {
  model: {};
  fields: any[];
}
