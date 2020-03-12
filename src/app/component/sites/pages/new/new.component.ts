import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { projectMenuItemActions } from "src/app/component/projects/pages/details/details.component";
import {
  projectCategory,
  projectMenuItem
} from "src/app/component/projects/projects.menus";
import { NewFormTemplate } from "src/app/helpers/formTemplate/newTemplate";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { SitesService } from "src/app/services/baw-api/sites.service";
import { newSiteMenuItem } from "../../sites.menus";
import { fields } from "./new.json";

@Page({
  category: projectCategory,
  menus: {
    actions: List<AnyMenuItem>([projectMenuItem, ...projectMenuItemActions]),
    links: List()
  },
  self: newSiteMenuItem
})
@Component({
  selector: "app-sites-new",
  template: `
    <app-form
      *ngIf="models"
      [schema]="schema"
      [title]="'New Site'"
      [submitLabel]="'Submit'"
      [submitLoading]="loading"
      (onSubmit)="submit($event)"
    ></app-form>
  `
})
export class NewComponent extends NewFormTemplate<Site, FormEvent> {
  constructor(
    private api: SitesService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(["project"], fields, notifications, route, router);
  }

  public getProject(): Project {
    return this.models.project as Project;
  }

  apiCreate(event: FormEvent) {
    return this.api.create(new Site({ ...event }), this.getProject());
  }

  successMessage(model: Site) {
    return "Successfully created " + model.name;
  }

  redirectPath(site: Site) {
    return site.redirectPath(this.getProject());
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
