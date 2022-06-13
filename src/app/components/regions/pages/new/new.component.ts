import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { RegionsService } from "@baw-api/region/regions.service";
import { projectMenuItemActions } from "@components/projects/pages/details/details.component";
import { projectCategory } from "@components/projects/projects.menus";
import {
  newRegionMenuItem,
  shallowNewRegionMenuItem,
  shallowRegionsCategory,
} from "@components/regions/regions.menus";
import {
  defaultSuccessMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { Region } from "@models/Region";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import schema from "../../region.schema.json";
import { regionsMenuItemActions } from "../list/list.component";

/**
 * New Region Component
 */
@Component({
  selector: "baw-regions-new",
  template: `
    <baw-form
      [title]="hideTitle ? '' : 'New Region'"
      [model]="model"
      [fields]="fields"
      [submitLoading]="loading"
      submitLabel="Submit"
      (onSubmit)="submit($event)"
    ></baw-form>
  `,
})
class NewComponent extends FormTemplate<Region> {
  @Input() public hideTitle: boolean;
  public fields = schema.fields;

  public constructor(
    private api: RegionsService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, {
      successMsg: (model) => defaultSuccessMsg("created", model.name),
      redirectUser: (model) => this.router.navigateByUrl(model.viewUrl),
    });
  }

  protected apiAction(model: Partial<Region>) {
    return this.api.create(new Region(model), this.model.projectId);
  }
}

NewComponent.linkToRoute({
  category: projectCategory,
  pageRoute: newRegionMenuItem,
  menus: { actions: List(projectMenuItemActions) },
}).linkToRoute({
  category: shallowRegionsCategory,
  pageRoute: shallowNewRegionMenuItem,
  menus: { actions: List(regionsMenuItemActions) },
});

export { NewComponent };
