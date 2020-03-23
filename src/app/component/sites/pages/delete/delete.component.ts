import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { PermissionsShieldComponent } from "src/app/component/shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "src/app/component/shared/widget/widgetItem";
import {
  deleteSiteMenuItem,
  siteMenuItem,
  sitesCategory
} from "src/app/component/sites/sites.menus";
import { WithFormCheck } from "src/app/guards/form/form.guard";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { ResolvedModel } from "src/app/services/baw-api/resolver-common";
import { SitesService } from "src/app/services/baw-api/sites.service";
import { siteMenuItemActions } from "../details/details.component";

/**
 * Delete Site Component
 */
@Page({
  category: sitesCategory,
  menus: {
    actions: List<AnyMenuItem>([siteMenuItem, ...siteMenuItemActions]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
    links: List()
  },
  resolvers: {
    project: "ProjectShowResolver",
    site: "SiteShowResolver"
  },
  self: deleteSiteMenuItem
})
@Component({
  selector: "app-projects-delete",
  template: `
    <app-form
      *ngIf="site"
      [schema]="{ model: {}, fields: [] }"
      [title]="'Are you certain you wish to delete ' + site.name + '?'"
      [btnColor]="'btn-danger'"
      [submitLabel]="'Delete'"
      [submitLoading]="loading"
      (onSubmit)="submit()"
    ></app-form>
  `
})
export class DeleteComponent extends WithFormCheck(PageComponent)
  implements OnInit {
  public loading: boolean;
  public project: Project;
  public site: Site;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: SitesService,
    private notification: ToastrService
  ) {
    super();
  }

  ngOnInit() {
    this.loading = false;

    const projectModel: ResolvedModel<Project> = this.route.snapshot.data
      .project;
    const siteModel: ResolvedModel<Site> = this.route.snapshot.data.site;

    if (projectModel.error || siteModel.error) {
      return;
    }

    this.project = projectModel.model;
    this.site = siteModel.model;
  }

  submit() {
    // This subscription must complete so takeuntil is ignored
    // so that it will run in the background in case the user
    // manages to navigate too fast
    this.loading = true;
    this.api
      .destroy(this.site, this.project)
      // tslint:disable-next-line: rxjs-prefer-angular-takeuntil
      .subscribe(
        () => {
          this.resetForms();
          this.notification.success("Site was successfully deleted.");
          this.router.navigateByUrl(this.project.redirectPath());
        },
        (err: ApiErrorDetails) => {
          this.loading = false;
          this.notification.error(err.message);
        }
      );
  }
}
