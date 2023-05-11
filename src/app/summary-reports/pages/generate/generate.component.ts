import { Component } from "@angular/core";
import { projectResolvers } from "@baw-api/project/projects.service";
import { PageComponent } from "@helpers/page/pageComponent";
import { generateProjectSummaryReportCategory, generateSummaryReportMenuItem } from "../../summary-report.menu";

const projectKey = "project";

@Component({
  selector: "baw-generate-summary-report",
  templateUrl: "./generate.component.html",
  styleUrls: ["./generate.component.css"]
})
class GenerateSummaryReportComponent extends PageComponent {
  public constructor() {
    super();
  }
}

GenerateSummaryReportComponent.linkToRoute({
  category: generateProjectSummaryReportCategory,
  pageRoute: generateSummaryReportMenuItem,
  resolvers: {
    [projectKey]: projectResolvers.show,
  },
});

export { GenerateSummaryReportComponent }
