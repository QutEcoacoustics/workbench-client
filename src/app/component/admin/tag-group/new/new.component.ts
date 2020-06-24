import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TagGroupsService } from "@baw-api/tag/tag-group.service";
import {
  defaultSuccessMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { Page } from "@helpers/page/pageDecorator";
import { TagGroup } from "@models/TagGroup";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { adminTagGroupsMenuItemActions } from "../list/list.component";
import {
  adminNewTagGroupMenuItem,
  adminTagGroupsCategory,
  adminTagGroupsMenuItem,
} from "../tag-group.menus";
import { fields } from "../tag-group.schema.json";

@Page({
  category: adminTagGroupsCategory,
  menus: {
    actions: List([adminTagGroupsMenuItem, ...adminTagGroupsMenuItemActions]),
    links: List(),
  },
  self: adminNewTagGroupMenuItem,
})
@Component({
  selector: "app-admin-tag-groups-new",
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
export class AdminTagGroupsNewComponent extends FormTemplate<TagGroup> {
  public fields = fields;

  constructor(
    private api: TagGroupsService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, undefined, (model) =>
      defaultSuccessMsg("created", model.groupIdentifier)
    );
  }

  protected apiAction(model: Partial<TagGroup>) {
    return this.api.create(new TagGroup(model));
  }
}
