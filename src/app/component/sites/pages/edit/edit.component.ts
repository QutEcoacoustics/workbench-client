import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { PermissionsShieldComponent } from "src/app/component/shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "src/app/component/shared/widget/widgetItem";
import { EditFormTemplate } from "src/app/helpers/formTemplate/editTemplate";
import { Page } from "src/app/helpers/page/pageDecorator";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { SitesService } from "src/app/services/baw-api/sites.service";
import {
  editSiteMenuItem,
  siteMenuItem,
  sitesCategory
} from "../../sites.menus";
import { siteMenuItemActions } from "../details/details.component";
import { fields } from "./edit.json";

@Page({
  category: sitesCategory,
  menus: {
    actions: List([siteMenuItem, ...siteMenuItemActions]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
    links: List()
  },
  self: editSiteMenuItem
})
@Component({
  selector: "app-sites-edit",
  template: `
    <app-wip *ngIf="models">
      <app-form
        [schema]="schema"
        [title]="'Edit ' + getSite().name"
        [submitLabel]="'Submit'"
        [submitLoading]="loading"
        (onSubmit)="submit($event)"
      ></app-form>
    </app-wip>
  `
})
export class EditComponent extends EditFormTemplate<Site, FormEvent> {
  constructor(
    private api: SitesService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(["site", "project"], fields, notifications, route, router);
  }

  public getSite(): Site {
    return this.models.site as Site;
  }

  public getProject(): Project {
    return this.models.project as Project;
  }

  preFillForm() {
    const site = this.getSite();

    this.schema.model["name"] = site.name;
    this.schema.model["description"] = site.description;
    this.schema.model["location"] = {
      customLatitude: site.customLatitude,
      customLongitude: site.customLongitude
    };
  }

  apiUpdate(event: FormEvent) {
    const site = this.getSite();
    const project = this.getProject();
    const updatedSite = new Site({ id: site.id, ...event });
    return this.api.update(updatedSite, project);
  }

  successMessage(model: Site) {
    return "Successfully updated " + model.name;
  }

  redirectPath(site: Site) {
    const project = this.getProject();
    return site.redirectPath(project);
  }
}

interface FormEvent {
  name: string;
  description: string;
  customLatitude: number;
  customLongitude: number;
  image: any;
  timezoneInformation: any;
}
