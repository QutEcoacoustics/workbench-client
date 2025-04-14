import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
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
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { List } from "immutable";
import { ToastService } from "@services/toasts/toasts.service";
import { FormComponent } from "@shared/form/form.component";
import { regionsMenuItemActions } from "../list/list.component";
import schema from "../../region.base.json";

const projectKey = "project";

/**
 * New Region Component
 */
@Component({
  selector: "baw-regions-new",
  template: `
    @if (!failure) {
      <baw-form
        [title]="hideTitle ? '' : 'New Site'"
        [model]="model"
        [fields]="fields"
        [submitLoading]="loading"
        submitLabel="Submit"
        (onSubmit)="submit($event)"
      ></baw-form>
    }
  `,
  imports: [FormComponent]
})
class NewComponent extends FormTemplate<Region> {
  @Input() public hideTitle: boolean;
  public fields = schema.fields;

  public constructor(
    private api: RegionsService,
    protected notifications: ToastService,
    protected route: ActivatedRoute,
    protected router: Router
  ) {
    super(notifications, route, router, {
      successMsg: (model) => defaultSuccessMsg("created", model.name),
      redirectUser: (model) => this.router.navigateByUrl(model.viewUrl),
    });
  }

  public get project(): Project {
    return this.models[projectKey] as Project;
  }

  protected apiAction(model: Partial<Region>) {
    return this.api.create(new Region(model), this.project);
  }
}

NewComponent.linkToRoute({
  category: projectCategory,
  pageRoute: newRegionMenuItem,
  menus: { actions: List(projectMenuItemActions) },
  resolvers: {
    [projectKey]: projectResolvers.show,
  },
}).linkToRoute({
  category: shallowRegionsCategory,
  pageRoute: shallowNewRegionMenuItem,
  menus: { actions: List(regionsMenuItemActions) },
  resolvers: {
    [projectKey]: projectResolvers.showDefault,
  },
});

export { NewComponent };
