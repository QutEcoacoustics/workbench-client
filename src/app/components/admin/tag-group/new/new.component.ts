import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TagGroupsService } from "@baw-api/tag/tag-group.service";
import {
  defaultSuccessMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { TagGroup } from "@models/TagGroup";
import { List } from "immutable";
import { ToastService } from "@services/toasts/toasts.service";
import { adminTagGroupsMenuItemActions } from "../list/list.component";
import {
  adminNewTagGroupMenuItem,
  adminTagGroupsCategory,
} from "../tag-group.menus";
import schema from "../tag-group.schema.json";

@Component({
  selector: "baw-admin-tag-groups-new",
  template: `
    <baw-form
      *ngIf="!failure"
      title="New Tag Group"
      [model]="model"
      [fields]="fields"
      [submitLoading]="loading"
      submitLabel="Submit"
      (onSubmit)="submit($event)"
    ></baw-form>
  `,
  standalone: false
})
class AdminTagGroupsNewComponent extends FormTemplate<TagGroup> {
  public fields = schema.fields;

  public constructor(
    private api: TagGroupsService,
    notifications: ToastService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, {
      successMsg: (model) =>
        defaultSuccessMsg("created", model.groupIdentifier),
      redirectUser: (model) => this.router.navigateByUrl(model.viewUrl),
    });
  }

  protected apiAction(model: Partial<TagGroup>) {
    return this.api.create(new TagGroup(model));
  }
}

AdminTagGroupsNewComponent.linkToRoute({
  category: adminTagGroupsCategory,
  pageRoute: adminNewTagGroupMenuItem,
  menus: { actions: List(adminTagGroupsMenuItemActions) },
});

export { AdminTagGroupsNewComponent };
