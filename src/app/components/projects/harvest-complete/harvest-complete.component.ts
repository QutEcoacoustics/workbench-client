import { Component, Input, OnInit } from "@angular/core";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { SitesService } from "@baw-api/site/sites.service";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { getUnknownViewUrl } from "@models/AbstractModel";
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

  public playPath(_site: Site) {
    // TODO Fix this, need audio recording for site
    // listenRecordingMenuItem
    return getUnknownViewUrl("Feature not implemented yet");
  }
}

interface TableRow {
  id: number;
  name: string;
  actions: Site;
}
