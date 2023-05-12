import { Component } from "@angular/core";
import { projectResolvers } from "@baw-api/project/projects.service";
import { Router } from "@angular/router";
import { PageComponent } from "@helpers/page/pageComponent";
import { generateProjectSummaryReportCategory, generateSummaryReportMenuItem } from "../../summary-report.menu";

const projectKey = "project";
@Component({
  selector: "baw-generate-summary-report",
  templateUrl: "./generate.component.html",
  styleUrls: ["./generate.component.scss"],
})
class GenerateSummaryReportComponent extends PageComponent {
  public constructor(
    public router: Router
  ) {
    super();
  }

  public submit(): void {
    this.router.navigateByUrl("/projects/1135/report");
  }
}

GenerateSummaryReportComponent.linkToRoute({
  category: generateProjectSummaryReportCategory,
  menus: {},
  pageRoute: generateSummaryReportMenuItem,
  resolvers: {
    [projectKey]: projectResolvers.show,
  },
});

export { GenerateSummaryReportComponent }
