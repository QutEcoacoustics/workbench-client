import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  tagGroupResolvers,
  TagGroupsService,
} from "@baw-api/tag/tag-group.service";
import {
  defaultSuccessMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
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

@Component({
  selector: "baw-admin-tag-groups-delete",
  template: `
    <baw-form
      *ngIf="!failure"
      [title]="title"
      [model]="model"
      [fields]="fields"
      btnColor="danger"
      submitLabel="Delete"
      [submitLoading]="loading"
      (onSubmit)="submit($event)"
    ></baw-form>
  `,
})
class AdminTagGroupsDeleteComponent
  extends FormTemplate<TagGroup>
  implements OnInit {
  public title: string;

  public constructor(
    private api: TagGroupsService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, tagGroupKey, (model) =>
      defaultSuccessMsg("destroyed", model.groupIdentifier)
    );
  }

  public ngOnInit() {
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

AdminTagGroupsDeleteComponent.linkComponentToPageInfo({
  category: adminTagGroupsCategory,
  menus: {
    actions: List([adminTagGroupsMenuItem, ...adminTagGroupMenuItemActions]),
  },
  resolvers: { [tagGroupKey]: tagGroupResolvers.show },
}).andMenuRoute(adminDeleteTagGroupMenuItem);

export { AdminTagGroupsDeleteComponent };
