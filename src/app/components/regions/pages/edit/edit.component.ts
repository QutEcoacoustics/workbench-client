import { Component, OnInit, inject } from "@angular/core";
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
import { licenseWidgetMenuItem, permissionsWidgetMenuItem } from "@menu/widget.menus";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { List } from "immutable";
import { ToastService } from "@services/toasts/toasts.service";
import { FormComponent } from "@shared/form/form.component";
import { regionMenuItemActions } from "../details/details.component";
import schema from "../../region.base.json";

const projectKey = "project";
const regionKey = "region";

/**
 * Edit Region Component
 */
@Component({
  selector: "baw-regions-edit",
  template: `
    @if (!failure) {
      <baw-form
        [title]="title"
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
class RegionEditComponent extends FormTemplate<Region> implements OnInit {
  private readonly api = inject(RegionsService);
  protected readonly notifications: ToastService;
  protected readonly route: ActivatedRoute;
  protected readonly router: Router;

  public fields = schema.fields;
  public title: string;

  public constructor() {
    const notifications = inject(ToastService);
    const route = inject(ActivatedRoute);
    const router = inject(Router);

    super(notifications, route, router, {
      getModel: (models) => models[regionKey] as Region,
      successMsg: (model) => defaultSuccessMsg("updated", model.name),
      redirectUser: (model) => this.router.navigateByUrl(model.viewUrl),
    });
  
    this.notifications = notifications;
    this.route = route;
    this.router = router;
  }

  public ngOnInit() {
    super.ngOnInit();

    if (!this.failure) {
      this.title = `Edit ${this.model.name}`;
    }
  }

  public get project(): Project {
    return this.models.project as Project;
  }

  protected apiAction(model: Partial<Region>) {
    return this.api.update(new Region(model), this.project);
  }
}

RegionEditComponent.linkToRoute({
  category: regionsCategory,
  pageRoute: editRegionMenuItem,
  menus: {
    actions: List(regionMenuItemActions),
    actionWidgets: List([
      permissionsWidgetMenuItem,
      licenseWidgetMenuItem
    ]),
  },
  resolvers: {
    [projectKey]: projectResolvers.show,
    [regionKey]: regionResolvers.show,
  },
});

export { RegionEditComponent };
