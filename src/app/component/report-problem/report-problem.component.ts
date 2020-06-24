import { Component, OnInit } from "@angular/core";
import { WithFormCheck } from "@guards/form/form.guard";
import { PageComponent } from "@helpers/page/pageComponent";
import { Page } from "@helpers/page/pageDecorator";
import { List } from "immutable";
import {
  reportProblemMenuItem,
  reportProblemsCategory,
} from "./report-problem.menus";
import { fields } from "./report-problem.schema.json";

@Page({
  category: reportProblemsCategory,
  menus: {
    actions: List(),
    links: List(),
  },
  self: reportProblemMenuItem,
})
@Component({
  selector: "app-report-problem",
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
export class ReportProblemComponent extends WithFormCheck(PageComponent)
  implements OnInit {
  public model = {};
  public fields = fields;
  public loading: boolean;
  public subTitle: string;

  constructor() {
    super();
  }

  ngOnInit() {
    this.subTitle = `Complete the form below to report a problem.
    Alternatively, we have a <a href='https://github.com/QutEcoacoustics/baw-server/issues'>Github Issues</a> page.`;
  }

  /**
   * Form submission
   * @param $event Form response
   */
  submit($event: any) {
    this.loading = true;
    console.log($event);
    this.loading = false;
  }
}
