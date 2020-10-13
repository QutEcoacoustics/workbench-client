import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import {
  regionResolvers,
  RegionsService,
} from "@baw-api/region/regions.service";
import {
  deleteRegionMenuItem,
  regionMenuItem,
  regionsCategory,
} from "@components/regions/regions.menus";
import {
  defaultSuccessMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { PermissionsShieldComponent } from "@shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "@shared/widget/widgetItem";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { regionMenuItemActions } from "../details/details.component";

const projectKey = "project";
const regionKey = "region";

/**
 * Delete Region Component
 */
@Component({
  selector: "app-regions-delete",
  template: `
    <baw-form
      *ngIf="!failure"
      [title]="title"
      [model]="model"
      [fields]="fields"
      btnColor="btn-danger"
      submitLabel="Delete"
      [submitLoading]="loading"
      (onSubmit)="submit($event)"
    ></baw-form>
  `,
})
class DeleteComponent extends FormTemplate<Region> implements OnInit {
  public title: string;

  constructor(
    private api: RegionsService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, regionKey, (model) =>
      defaultSuccessMsg("destroyed", model.name)
    );
  }

  public ngOnInit() {
    super.ngOnInit();

    if (!this.failure) {
      this.title = `Are you certain you wish to delete ${this.model.name}?`;
    }
  }

  public get project(): Project {
    return this.models[projectKey] as Project;
  }

  protected redirectionPath() {
    return this.project.viewUrl;
  }

  protected apiAction(model: Partial<Region>) {
    return this.api.destroy(new Region(model), this.project);
  }
}

DeleteComponent.LinkComponentToPageInfo({
  category: regionsCategory,
  menus: {
    actions: List([regionMenuItem, ...regionMenuItemActions]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
  },
  resolvers: {
    [projectKey]: projectResolvers.show,
    [regionKey]: regionResolvers.show,
  },
}).AndMenuRoute(deleteRegionMenuItem);

export { DeleteComponent };
