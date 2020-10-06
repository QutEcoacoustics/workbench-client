import { Component, OnInit } from "@angular/core";
import { projectResolvers } from "@baw-api/project/projects.service";
import { projectMenuItemActions } from "@components/projects/pages/details/details.component";
import {
  projectCategory,
  projectMenuItem,
} from "@components/projects/projects.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { List } from "immutable";
import { newSiteMenuItem } from "../../sites.menus";

const projectKey = "project";

@Component({
  selector: "app-wizard",
  styles: [
    `
      button {
        width: 125px;
      }
    `,
  ],
  template: `
    <h1>New Site</h1>

    <p class="lead">Do you have more than one sensor at this site?</p>

    <div class="float-right">
      <button
        type="button"
        class="btn btn-outline-dark mr-3"
        [ngClass]="{ active: isCreating.region }"
        (click)="submit(false)"
      >
        No
      </button>
      <button
        type="button"
        class="btn btn-outline-dark"
        [ngClass]="{ active: isCreating.site }"
        (click)="submit(true)"
      >
        Yes
      </button>
    </div>
  `,
})
class WizardComponent extends PageComponent implements OnInit {
  public isCreating = { site: false, region: false };

  constructor() {
    super();
  }

  public ngOnInit(): void {}

  public submit(response: boolean) {
    console.log("Submitted: ", response);
    this.isCreating = { site: response, region: !response };
  }
}

WizardComponent.LinkComponentToPageInfo({
  category: projectCategory,
  menus: { actions: List([projectMenuItem, ...projectMenuItemActions]) },
  resolvers: { [projectKey]: projectResolvers.show },
}).AndMenuRoute(newSiteMenuItem);

export { WizardComponent };
