import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import { retrieveResolvers } from "@baw-api/resolver-common";
import {
  assignSiteMenuItem,
  deleteProjectMenuItem,
  editProjectMenuItem,
  editProjectPermissionsMenuItem,
  projectCategory,
  projectMenuItem,
  projectsMenuItem,
} from "@components/projects/projects.menus";
import { newRegionMenuItem } from "@components/regions/regions.menus";
import { newSiteMenuItem } from "@components/sites/sites.menus";
import { exploreAudioMenuItem } from "@helpers/page/externalMenus";
import { PageComponent } from "@helpers/page/pageComponent";
import { Project } from "@models/Project";
import { PermissionsShieldComponent } from "@shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "@shared/widget/widgetItem";
import { List } from "immutable";

export const projectMenuItemActions = [
  exploreAudioMenuItem,
  editProjectMenuItem,
  editProjectPermissionsMenuItem,
  newSiteMenuItem,
  newRegionMenuItem,
  assignSiteMenuItem,
  deleteProjectMenuItem,
];

const projectKey = "project";

@Component({
  selector: "app-project",
  template: `
    <ng-container *ngIf="project">
      <h1>{{ project.name }}</h1>
      <div class="row">
        <div class="col-sm-4">
          <div class="thumbnail">
            <img [src]="project.image" [alt]="project.name + ' image'" />
          </div>
        </div>
        <div class="col-sm-8">
          <p
            id="project_description"
            [innerHTML]="project.descriptionHtml || defaultDescription"
          ></p>
        </div>
      </div>

      <p class="lead" *ngIf="!hasSites && !hasRegions">
        No additional data to display here, try adding sites or regions to the
        project
      </p>

      <app-site-cards *ngIf="hasSites" [project]="project"></app-site-cards>
      <app-region-cards
        *ngIf="hasRegions"
        [project]="project"
      ></app-region-cards>
    </ng-container>
  `,
  styleUrls: ["./details.component.scss"],
})
class DetailsComponent extends PageComponent implements OnInit {
  public defaultDescription = "<i>No description found</i>";
  public project: Project;
  public hasRegions: boolean;
  public hasSites: boolean;

  constructor(private route: ActivatedRoute) {
    super();
  }

  public ngOnInit() {
    const resolvedModels = retrieveResolvers(this.route.snapshot.data);
    if (!resolvedModels) {
      return;
    }
    this.project = resolvedModels[projectKey] as Project;
    this.hasRegions = this.project.regionIds.size > 0;
    this.hasSites = this.project.siteIds.size > 0;
  }
}

DetailsComponent.LinkComponentToPageInfo({
  category: projectCategory,
  menus: {
    actions: List([projectsMenuItem, ...projectMenuItemActions]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
  },
  resolvers: { [projectKey]: projectResolvers.show },
}).AndMenuRoute(projectMenuItem);

export { DetailsComponent };
