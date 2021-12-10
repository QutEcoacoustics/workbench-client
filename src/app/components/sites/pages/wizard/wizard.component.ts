import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import {
  hasResolvedSuccessfully,
  retrieveResolvers,
} from "@baw-api/resolver-common";
import { projectMenuItemActions } from "@components/projects/pages/details/details.component";
import {
  projectCategory,
  projectMenuItem,
} from "@components/projects/projects.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { PageInfo } from "@helpers/page/pageInfo";
import { Project } from "@models/Project";
import { List } from "immutable";
import { newSiteMenuItem } from "../../sites.menus";

const projectKey = "project";

@Component({
  selector: "baw-wizard",
  styles: [
    `
      button {
        width: 100px;
      }
    `,
  ],
  template: `
    <ng-container *ngIf="!error">
      <h2 class="text-center">New Site</h2>

      <p class="lead">Do you have more than one sensor at this site?</p>

      <div class="d-flex flex-row-reverse">
        <button
          type="button"
          class="btn btn-outline-dark"
          [ngClass]="{ active: isCreating.region }"
          (click)="submit(true)"
        >
          Yes
        </button>
        <button
          type="button"
          class="btn btn-outline-dark me-3"
          [ngClass]="{ active: isCreating.site }"
          (click)="submit(false)"
        >
          No
        </button>
      </div>

      <baw-sites-new *ngIf="isCreating.site"></baw-sites-new>
      <baw-regions-new
        *ngIf="isCreating.region"
        [hideTitle]="true"
      ></baw-regions-new>
    </ng-container>
  `,
})
class WizardComponent extends PageComponent implements OnInit {
  public error: boolean;
  public isCreating = { site: false, region: false };
  public project: Project;

  public constructor(private route: ActivatedRoute) {
    super();
  }

  public ngOnInit(): void {
    const models = retrieveResolvers(this.route.snapshot.data as PageInfo);
    if (!hasResolvedSuccessfully(models)) {
      this.error = true;
      return;
    }

    this.project = models[projectKey] as Project;
  }

  public submit(isRegion: boolean) {
    this.isCreating = { site: !isRegion, region: isRegion };
  }
}

WizardComponent.linkToRoute({
  category: projectCategory,
  menuRoute: newSiteMenuItem,
  menus: { actions: List([projectMenuItem, ...projectMenuItemActions]) },
  resolvers: { [projectKey]: projectResolvers.show },
});

export { WizardComponent };
