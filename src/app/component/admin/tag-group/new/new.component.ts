import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import {
  defaultSuccessMsg,
  FormTemplate
} from "src/app/helpers/formTemplate/formTemplate";
import { Page } from "src/app/helpers/page/pageDecorator";
import { TagGroup } from "src/app/models/TagGroup";
import { TagGroupService } from "src/app/services/baw-api/tag-group.service";
import {
  adminNewTagGroupMenuItem,
  adminTagGroupsCategory,
  adminTagGroupsMenuItem
} from "../../admin.menus";
import { adminTagGroupsMenuItemActions } from "../list/list.component";
import { fields } from "../tag-group.json";

@Page({
  category: adminTagGroupsCategory,
  menus: {
    actions: List([adminTagGroupsMenuItem, ...adminTagGroupsMenuItemActions]),
    links: List()
  },
  self: adminNewTagGroupMenuItem
})
@Component({
  selector: "app-admin-tag-groups-new",
  template: `
    <app-form
      *ngIf="!failure"
      title="New Tag Group"
      [model]="model"
      [fields]="fields"
      [submitLoading]="loading"
      submitLabel="Submit"
      (onSubmit)="submit($event)"
    ></app-form>
  `
})
export class AdminTagGroupsNewComponent extends FormTemplate<TagGroup> {
  public fields = fields;

  constructor(
    private api: TagGroupService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, undefined, model =>
      defaultSuccessMsg("created", model.groupIdentifier)
    );
  }

  protected apiAction(model: Partial<TagGroup>) {
    return this.api.create(new TagGroup(model));
  }
}
