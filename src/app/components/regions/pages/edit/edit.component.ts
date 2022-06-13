import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import {
  regionResolvers,
  RegionsService,
} from "@baw-api/region/regions.service";
import {
  editRegionMenuItem,
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
import schema from "../../region.schema.json";
import { regionMenuItemActions } from "../details/details.component";

const projectKey = "project";
const regionKey = "region";

/**
 * Edit Region Component
 */
@Component({
  selector: "baw-regions-edit",
  template: `
    <baw-form
      [title]="'Edit ' + model.name"
      [model]="model"
      [fields]="fields"
      [submitLoading]="loading"
      submitLabel="Submit"
      (onSubmit)="submit($event)"
    ></baw-form>
  `,
})
class EditComponent extends FormTemplate<Region> implements OnInit {
  public fields = schema.fields;

  public constructor(
    private api: RegionsService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, {
      getModel: (models) => models[regionKey] as Region,
      successMsg: (model) => defaultSuccessMsg("updated", model.name),
      redirectUser: (model) => this.router.navigateByUrl(model.viewUrl),
    });
  }

  public get project(): Project {
    return this.models[projectKey] as Project;
  }

  protected apiAction(model: Partial<Region>) {
    return this.api.update(new Region(model), this.project);
  }
}

EditComponent.linkToRoute({
  category: regionsCategory,
  pageRoute: editRegionMenuItem,
  menus: {
    actions: List(regionMenuItemActions),
    actionWidgets: List([permissionsWidgetMenuItem]),
  },
  resolvers: {
    [projectKey]: projectResolvers.show,
    [regionKey]: regionResolvers.show,
  },
});

export { EditComponent };
