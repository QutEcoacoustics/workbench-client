import { Component, OnInit } from "@angular/core";
import { withFormCheck } from "@guards/form/form.guard";
import { PageComponent } from "@helpers/page/pageComponent";
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
        [subTitle]="subTitle"
        [model]="model"
        [fields]="fields"
        submitLabel="Submit"
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

  public constructor() {
    super();
  }

  public ngOnInit() {
    this.subTitle = `Complete the form below to report a problem.
    Alternatively, we have a <a href='https://github.com/QutEcoacoustics/baw-server/issues'>Github Issues</a> page.`;
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
