import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import {
  regionResolvers,
  RegionsService,
} from "@baw-api/region/regions.service";
import {
  deleteRegionMenuItem,
  regionsCategory,
} from "@components/regions/regions.menus";
import {
  defaultSuccessMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { permissionsWidgetMenuItem } from "@menu/widget.menus";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { regionMenuItemActions } from "../details/details.component";

const projectKey = "project";
const regionKey = "region";

/**
 * Delete Region Component
 */
@Component({
  selector: "baw-regions-delete",
  template: `
    <baw-form
      *ngIf="!failure"
      [title]="title"
      [model]="model"
      [fields]="fields"
      btnColor="danger"
      submitLabel="Delete"
      [submitLoading]="loading"
      (onSubmit)="submit($event)"
    ></baw-form>
  `,
})
class DeleteComponent extends FormTemplate<Region> implements OnInit {
  public title: string;

  public constructor(
    private api: RegionsService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, {
      getModel: (models) => models[regionKey] as Region,
      successMsg: (model) => defaultSuccessMsg("destroyed", model.name),
      redirectUser: () => this.router.navigateByUrl(this.project.viewUrl),
    });
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

  protected apiAction(model: Partial<Region>) {
    return this.api.destroy(new Region(model), this.project);
  }
}

DeleteComponent.linkToRoute({
  category: regionsCategory,
  pageRoute: deleteRegionMenuItem,
  menus: {
    actions: List(regionMenuItemActions),
    actionWidgets: List([permissionsWidgetMenuItem]),
  },
  resolvers: {
    [projectKey]: projectResolvers.show,
    [regionKey]: regionResolvers.show,
  },
});

export { DeleteComponent };
