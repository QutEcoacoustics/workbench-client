import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { takeUntil } from "rxjs/operators";
import { projectMenuItemActions } from "src/app/component/projects/pages/details/details.component";
import {
  projectCategory,
  projectMenuItem
} from "src/app/component/projects/projects.menus";
import { flattenFields } from "src/app/component/shared/form/form.component";
import { WithFormCheck } from "src/app/guards/form/form.guard";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { ResolvedModel } from "src/app/services/baw-api/resolver-common";
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
      *ngIf="project"
      [schema]="schema"
      [title]="'New Site'"
      [submitLabel]="'Submit'"
      [submitLoading]="loading"
      (onSubmit)="submit($event)"
    ></app-form>
  `
})
export class NewComponent extends WithFormCheck(PageComponent)
  implements OnInit {
  public loading: boolean;
  public project: Project;
  public schema = { model: {}, fields };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sitesApi: SitesService,
    private notification: ToastrService
  ) {
    super();
  }

  ngOnInit() {
    this.loading = false;

    const projectModel: ResolvedModel<Project> = this.route.snapshot.data
      .project;

    if (projectModel.error) {
      return;
    }

    this.project = projectModel.model;
  }

  /**
   * Form submission
   * @param $event Form response
   */
  submit($event: any) {
    this.loading = true;

    const newSite = new Site(flattenFields($event));

    this.sitesApi
      .create(newSite, this.project)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (createdSite: Site) => {
          this.resetForms();
          this.notification.success("Site was successfully created.");
          this.router.navigateByUrl(createdSite.redirectPath(this.project));
        },
        (err: ApiErrorDetails) => {
          this.loading = false;
          this.notification.error(err.message);
        }
      );
  }
}
