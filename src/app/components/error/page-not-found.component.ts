import { Component } from "@angular/core";
import { homeCategory } from "@components/home/home.menus";
import { reportProblemMenuItem } from "@components/report-problem/report-problem.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { pageNotFoundMenuItem } from "./error.menus";

@Component({
  selector: "baw-page-not-found",
  template: `
    <h1>Not Found</h1>
    <div>
      This page doesn't seem to exist, if you believe this is an error please go
      to the <a [strongRoute]="reportProblem">Report Problems</a> page and
      report the issue.
    </div>
  `,
})
class PageNotFoundComponent extends PageComponent {
  public reportProblem = reportProblemMenuItem.route;
}

PageNotFoundComponent.linkComponentToPageInfo({
  category: homeCategory,
}).andMenuRoute(pageNotFoundMenuItem);
export { PageNotFoundComponent };
