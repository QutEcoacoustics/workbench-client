import { Component, Input, OnInit } from "@angular/core";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { SitesService } from "@baw-api/site/sites.service";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { Project } from "@models/Project";
import { Site } from "@models/Site";

@Component({
  selector: "baw-project-harvest-complete",
  templateUrl: "./harvest-complete.component.html",
})
export class HarvestCompleteComponent
  extends PagedTableTemplate<TableRow, Site>
  implements OnInit {
  @Input() public project: Project;
  public sites: Site[];
  public error: ApiErrorDetails;
  public columns = [{ name: "Id" }, { name: "Name" }, { name: "Actions" }];
  public sortKeys = { id: "id", name: "name" };

  public constructor(api: SitesService) {
    super(
      api,
      (sites) =>
        sites.map((site) => ({
          id: site.id,
          name: site.name,
          actions: site,
        })),
      undefined,
      (component: HarvestCompleteComponent) => [component.project]
    );
  }

  public detailsPath(site: Site) {
    return site.getViewUrl(this.project);
  }

  public playPath(site: Site) {
    return "/play_url";
  }

  public visualizePath(site: Site) {
    return site.visualizeUrl;
  }
}

interface TableRow {
  id: number;
  name: string;
  actions: Site;
}
