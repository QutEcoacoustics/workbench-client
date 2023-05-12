import { Component } from "@angular/core";
import { projectResolvers } from "@baw-api/project/projects.service";
import {
  summaryReportCategory,
  summaryReportMenuItem
} from "@components/summary-reports/summary-report.menu";
import { PageComponent } from "@helpers/page/pageComponent";

const projectKey = "project";

@Component({
  selector: "baw-summary-report",
  templateUrl: "./report.component.html",
  styleUrls: ["./report.component.scss"],
})
class SummaryReportComponent extends PageComponent {
  public constructor() {
    super();
  }
}

SummaryReportComponent.linkToRoute({
  category: summaryReportCategory,
  menus: {},
  pageRoute: summaryReportMenuItem,
  resolvers: {
    [projectKey]: projectResolvers.show,
  },
});

export { SummaryReportComponent }
