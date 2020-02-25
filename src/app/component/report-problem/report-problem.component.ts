import { Component, OnInit } from "@angular/core";
import { List } from "immutable";
import { WithFormCheck } from "src/app/guards/form/form.guard.js";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { fields } from "./report-problem.json";
import {
  reportProblemMenuItem,
  reportProblemsCategory
} from "./report-problem.menus";

@Page({
  category: reportProblemsCategory,
  menus: {
    actions: List(),
    links: List()
  },
  self: reportProblemMenuItem
})
@Component({
  selector: "app-report-problem",
  template: `
    <app-wip>
      <app-form
        [schema]="schema"
        [title]="'Report Problem'"
        [subTitle]="subTitle"
        [error]="error"
        [submitLabel]="'Submit'"
        [submitLoading]="loading"
        (onSubmit)="submit($event)"
      ></app-form>
    </app-wip>
  `
})
export class ReportProblemComponent extends WithFormCheck(PageComponent)
  implements OnInit {
  schema = { model: {}, fields };
  error: string;
  loading: boolean;
  subTitle: string;

  constructor() {
    super();
  }

  ngOnInit() {
    this.loading = false;
    this.subTitle = `
    Complete the form below to report a problem.
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
