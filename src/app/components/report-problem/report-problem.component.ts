import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  ReportProblem,
  ReportProblemService,
} from "@baw-api/report/report-problem.service";
import {
  defaultErrorMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { ConfigService } from "@services/config/config.service";
import { RecaptchaState } from "@shared/form/form.component";
import { ToastrService } from "ngx-toastr";
import { takeUntil } from "rxjs/operators";
import {
  reportProblemMenuItem,
  reportProblemsCategory,
} from "./report-problem.menus";
import { fields } from "./report-problem.schema.json";

@Component({
  selector: "baw-report-problem",
  template: `
    <baw-form
      title="Report Problem"
      submitLabel="Submit"
      [subTitle]="subTitle"
      [model]="model"
      [fields]="fields"
      [submitLoading]="loading"
      [recaptchaSeed]="recaptchaSeed"
      (onSubmit)="submit($event)"
    ></baw-form>
  `,
})
class ReportProblemComponent
  extends FormTemplate<ReportProblem>
  implements OnInit {
  public fields = fields;
  public recaptchaSeed: RecaptchaState = { state: "loading" };
  public subTitle: string;

  public constructor(
    private api: ReportProblemService,
    private config: ConfigService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(
      notifications,
      route,
      router,
      undefined,
      () =>
        "Thank you, your report was successfully submitted." +
        "If you entered an email address, we will let you know if the problems you describe are resolved.",
      defaultErrorMsg
    );
  }

  public ngOnInit() {
    super.ngOnInit();

    this.subTitle = `
      Complete the form below to report a problem.
      Alternatively, we have a <a href='${this.config.values.links.sourceRepository}'>
      Github Issues</a> page.
    `;

    this.api
      .seed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (seed) => {
          console.log("Contact Us Seed: " + seed);
          this.recaptchaSeed = { state: "loaded", seed };
        },
        (err) => {
          console.error(err);
          this.notifications.error("Failed to load form");
        }
      );
  }

  protected apiAction(model: ReportProblem) {
    return this.api.reportProblem(new ReportProblem(model));
  }

  protected redirectUser() {
    // Do nothing
  }
}

ReportProblemComponent.linkComponentToPageInfo({
  category: reportProblemsCategory,
}).andMenuRoute(reportProblemMenuItem);

export { ReportProblemComponent };
