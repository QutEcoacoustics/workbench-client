import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { takeUntil } from "rxjs/operators";
import { PermissionsShieldComponent } from "src/app/component/shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "src/app/component/shared/widget/widgetItem";
import { WithFormCheck } from "src/app/guards/form/form.guard";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { ResolvedModel } from "src/app/services/baw-api/resolver-common";
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
    <app-wip *ngIf="site">
      <app-form
        [schema]="schema"
        [title]="'Edit ' + site.name"
        [submitLabel]="'Submit'"
        [submitLoading]="loading"
        (onSubmit)="submit($event)"
      ></app-form>
    </app-wip>
  `
})
export class EditComponent extends WithFormCheck(PageComponent)
  implements OnInit {
  public loading: boolean;
  public project: Project;
  public schema = { model: {}, fields };
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

    this.schema.model["name"] = this.site.name;
    this.schema.model["description"] = this.site.description;
  }

  /**
   * Form submission
   * @param $event Form response
   */
  submit($event: any) {
    this.loading = true;

    const updatedSite = new Site({
      id: this.site.id,
      ...$event
    });

    this.api
      .update(updatedSite, this.project)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        () => {
          this.resetForms();
          this.notification.success("Site was successfully updated.");
          this.router.navigateByUrl(this.site.redirectPath(this.project));
        },
        (err: ApiErrorDetails) => {
          this.notification.error(err.message);
          this.loading = false;
        }
      );
  }
}
