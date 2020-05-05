import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  tagGroupResolvers,
  TagGroupService,
} from "@baw-api/tag/tag-group.service";
import {
  defaultSuccessMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { Page } from "@helpers/page/pageDecorator";
import { TagGroup } from "@models/TagGroup";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { adminTagGroupMenuItemActions } from "../list/list.component";
import {
  adminDeleteTagGroupMenuItem,
  adminTagGroupsCategory,
  adminTagGroupsMenuItem,
} from "../tag-group.menus";

const tagGroupKey = "tagGroup";

@Page({
  category: adminTagGroupsCategory,
  menus: {
    actions: List([adminTagGroupsMenuItem, ...adminTagGroupMenuItemActions]),
    links: List(),
  },
  resolvers: {
    [tagGroupKey]: tagGroupResolvers.show,
  },
  self: adminDeleteTagGroupMenuItem,
})
@Component({
  selector: "app-admin-tag-groups-delete",
  template: `
    <app-form
      *ngIf="!failure"
      [title]="title"
      [model]="model"
      [fields]="fields"
      btnColor="btn-danger"
      submitLabel="Delete"
      [submitLoading]="loading"
      (onSubmit)="submit($event)"
    ></app-form>
  `,
})
export class AdminTagGroupsDeleteComponent extends FormTemplate<TagGroup>
  implements OnInit {
  public title: string;

  constructor(
    private api: TagGroupService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, tagGroupKey, (model) =>
      defaultSuccessMsg("destroyed", model.groupIdentifier)
    );
  }

  ngOnInit() {
    super.ngOnInit();

    if (!this.failure) {
      this.title = `Are you certain you wish to delete ${this.model.groupIdentifier}?`;
    }
  }
  protected redirectionPath() {
    return adminTagGroupsMenuItem.route.toString();
  }

  protected apiAction(model: Partial<TagGroup>) {
    return this.api.destroy(new TagGroup(model));
  }
}
