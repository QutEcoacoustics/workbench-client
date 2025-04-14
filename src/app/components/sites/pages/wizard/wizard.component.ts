import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import {
  hasResolvedSuccessfully,
  retrieveResolvers,
} from "@baw-api/resolver-common";
import { projectMenuItemActions } from "@components/projects/pages/details/details.component";
import { projectCategory } from "@components/projects/projects.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import { Project } from "@models/Project";
import { List } from "immutable";
import { NgClass } from "@angular/common";
import { newSiteMenuItem } from "../../sites.menus";
import { SiteNewComponent } from "../new/new.component";
import { NewComponent } from "../../../regions/pages/new/new.component";

const projectKey = "project";

@Component({
  selector: "baw-wizard",
  styles: [`
    button {
      width: 100px;
    }
  `],
  template: `
    @if (!error) {
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

      @if (isCreating.site) {
        <baw-sites-new></baw-sites-new>
      }

      @if (isCreating.region) {
        <baw-regions-new [hideTitle]="true"></baw-regions-new>
      }
    }
  `,
  imports: [NgClass, SiteNewComponent, NewComponent],
})
class WizardComponent extends PageComponent implements OnInit {
  public error: boolean;
  public isCreating = { site: false, region: false };
  public project: Project;

  public constructor(private route: ActivatedRoute) {
    super();
  }

  public ngOnInit(): void {
    const models = retrieveResolvers(this.route.snapshot.data as IPageInfo);
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
  pageRoute: newSiteMenuItem,
  menus: { actions: List(projectMenuItemActions) },
  resolvers: { [projectKey]: projectResolvers.show },
});

export { WizardComponent };
