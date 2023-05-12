import { Component } from "@angular/core";
import { projectResolvers } from "@baw-api/project/projects.service";
import { FormTemplate } from "@helpers/formTemplate/formTemplate";
import { AbstractModel } from "@models/AbstractModel";
import { Observable } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { generateProjectSummaryReportCategory, generateSummaryReportMenuItem } from "../../summary-report.menu";
import schema from "./generate.base.schema.json";

const projectKey = "project";

class Fields extends AbstractModel {
  public get viewUrl(): string {
    throw new Error("Method not implemented.");
  }
  public sites: string;
}

@Component({
  selector: "baw-generate-summary-report",
  templateUrl: "./generate.component.html",
  styleUrls: ["./generate.component.scss"],
})
class GenerateSummaryReportComponent extends FormTemplate<Fields> {
  public constructor(
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, {});
  }

  public fields = schema.fields;

  public submit(): void {
    this.router.navigateByUrl("/projects/1135/report");
  }

  protected apiAction(): Observable<void | Fields> {
    throw new Error("Method not implemented.");
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
