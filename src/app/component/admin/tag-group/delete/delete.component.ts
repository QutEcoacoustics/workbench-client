import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import {
  defaultSuccessMsg,
  FormTemplate
} from "src/app/helpers/formTemplate/formTemplate";
import { Page } from "src/app/helpers/page/pageDecorator";
import { TagGroup } from "src/app/models/TagGroup";
import {
  tagGroupResolvers,
  TagGroupService
} from "src/app/services/baw-api/tag-group.service";
import {
  adminDeleteTagGroupMenuItem,
  adminTagGroupsCategory,
  adminTagGroupsMenuItem
} from "../../admin.menus";
import { adminTagGroupMenuItemActions } from "../list/list.component";

const tagGroupKey = "tagGroup";

@Page({
  category: adminTagGroupsCategory,
  menus: {
    actions: List([adminTagGroupsMenuItem, ...adminTagGroupMenuItemActions]),
    links: List()
  },
  resolvers: {
    [tagGroupKey]: tagGroupResolvers.show
  },
  self: adminDeleteTagGroupMenuItem
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
  `
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
    super(notifications, route, router, tagGroupKey, model =>
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
