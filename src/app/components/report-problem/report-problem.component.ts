import { Component, OnInit, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ReportProblemService } from "@baw-api/report/report-problem.service";
import { FormTemplate } from "@helpers/formTemplate/formTemplate";
import { ReportProblem } from "@models/data/ReportProblem";
import { ConfigService } from "@services/config/config.service";
import { RecaptchaState , FormComponent } from "@shared/form/form.component";
import { takeUntil } from "rxjs/operators";
import { ToastService } from "@services/toasts/toasts.service";
import {
  reportProblemMenuItem,
  reportProblemsCategory,
} from "./report-problem.menus";
import schema from "./report-problem.schema.json";

@Component({
  selector: "baw-report-problem",
  template: `
    <baw-form
      title="Report Problem"
      submitLabel="Submit"
      [model]="model"
      [fields]="fields"
      [submitLoading]="loading"
      [recaptchaSeed]="recaptchaSeed"
      (onSubmit)="submit($event)"
    >
      <span id="subTitle">
        Complete the form below to report a problem. Alternatively, we have a
        <a [href]="sourceRepoLink">Github Issues</a> page.
      </span>
    </baw-form>
  `,
  imports: [FormComponent]
})
class ReportProblemComponent
  extends FormTemplate<ReportProblem>
  implements OnInit
{
  private readonly api = inject(ReportProblemService);
  private readonly config = inject(ConfigService);
  protected readonly notifications: ToastService;
  protected readonly route: ActivatedRoute;
  protected readonly router: Router;

  public fields = schema.fields;
  public recaptchaSeed: RecaptchaState = { state: "loading" };
  public sourceRepoLink: string;

  public constructor() {
    const notifications = inject(ToastService);
    const route = inject(ActivatedRoute);
    const router = inject(Router);

    super(notifications, route, router, {
      successMsg: () =>
        "Thank you, your report was successfully submitted." +
        "If you entered an email address, we will let you know if the problems you describe are resolved.",
    });
  
    this.notifications = notifications;
    this.route = route;
    this.router = router;
  }

  public ngOnInit() {
    super.ngOnInit();

    this.sourceRepoLink = this.config.settings.links.sourceRepositoryIssues;
    this.api
      .seed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: ({ seed, action }) =>
          (this.recaptchaSeed = { state: "loaded", seed, action }),
        error: (err) => {
          console.error(err);
          this.notifications.error("Failed to load form");
        },
      });
  }

  protected apiAction(model: ReportProblem) {
    return this.api.reportProblem(new ReportProblem(model));
  }
}

ReportProblemComponent.linkToRoute({
  category: reportProblemsCategory,
  pageRoute: reportProblemMenuItem,
});

export { ReportProblemComponent };
