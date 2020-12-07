import { Component, OnInit } from "@angular/core";
import { withFormCheck } from "@guards/form/form.guard";
import { PageComponent } from "@helpers/page/pageComponent";
import { AppConfigService } from "@services/app-config/app-config.service";
import {
  reportProblemMenuItem,
  reportProblemsCategory,
} from "./report-problem.menus";
import { fields } from "./report-problem.schema.json";

@Component({
  selector: "baw-report-problem",
  template: `
    <baw-wip>
      <baw-form
        title="Report Problem"
        submitLabel="Submit"
        [subTitle]="subTitle"
        [model]="model"
        [fields]="fields"
        [submitLoading]="loading"
        (onSubmit)="submit($event)"
      ></baw-form>
    </baw-wip>
  `,
})
class ReportProblemComponent
  extends withFormCheck(PageComponent)
  implements OnInit {
  public model = {};
  public fields = fields;
  public loading: boolean;
  public subTitle: string;

  public constructor(private config: AppConfigService) {
    super();
  }

  public ngOnInit() {
    this.subTitle = `
      Complete the form below to report a problem.
      Alternatively, we have a <a href='${this.config.values.links.githubBawServerIssues}'>
      Github Issues</a> page.
    `;
  }

  /**
   * Form submission
   *
   * @param $event Form response
   */
  public submit($event: any) {
    this.loading = true;
    console.log($event);
    this.loading = false;
  }
}

ReportProblemComponent.linkComponentToPageInfo({
  category: reportProblemsCategory,
}).andMenuRoute(reportProblemMenuItem);

export { ReportProblemComponent };
