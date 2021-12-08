import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TagGroupsService } from "@baw-api/tag/tag-group.service";
import {
  defaultSuccessMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { TagGroup } from "@models/TagGroup";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { adminTagGroupsMenuItemActions } from "../list/list.component";
import {
  adminNewTagGroupMenuItem,
  adminTagGroupsCategory,
  adminTagGroupsMenuItem,
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
})
class AdminTagGroupsNewComponent extends FormTemplate<TagGroup> {
  public fields = schema.fields;

  public constructor(
    private api: TagGroupsService,
    notifications: ToastrService,
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

AdminTagGroupsNewComponent.linkToRouterWith(
  {
    category: adminTagGroupsCategory,
    menus: {
      actions: List([adminTagGroupsMenuItem, ...adminTagGroupsMenuItemActions]),
    },
  },
  adminNewTagGroupMenuItem
);

export { AdminTagGroupsNewComponent };
