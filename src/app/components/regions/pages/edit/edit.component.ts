import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import {
  regionResolvers,
  RegionsService,
} from "@baw-api/region/regions.service";
import {
  editRegionMenuItem,
  regionMenuItem,
  regionsCategory,
} from "@components/regions/regions.menus";
import {
  defaultSuccessMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { PermissionsShieldComponent } from "@menu/permissions-shield.component";
import { WidgetMenuItem } from "@menu/widgetItem";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { fields } from "../../region.base.json";
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
      *ngIf="!failure"
      [title]="title"
      [model]="model"
      [fields]="fields"
      [submitLoading]="loading"
      submitLabel="Submit"
      (onSubmit)="submit($event)"
    ></baw-form>
  `,
})
class EditComponent extends FormTemplate<Region> implements OnInit {
  public fields = fields;
  public title: string;

  public constructor(
    private api: RegionsService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, regionKey, (model) =>
      defaultSuccessMsg("updated", model.name)
    );
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

EditComponent.LinkComponentToPageInfo({
  category: regionsCategory,
  menus: {
    actions: List([regionMenuItem, ...regionMenuItemActions]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
  },
  resolvers: {
    [projectKey]: projectResolvers.show,
    [regionKey]: regionResolvers.show,
  },
}).AndMenuRoute(editRegionMenuItem);

export { EditComponent };
