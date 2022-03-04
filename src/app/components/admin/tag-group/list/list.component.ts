import { Component } from "@angular/core";
import { TagGroupsService } from "@baw-api/tag/tag-group.service";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { Id } from "@interfaces/apiInterfaces";
import { TagGroup } from "@models/TagGroup";
import { List } from "immutable";
import {
  adminDeleteTagGroupMenuItem,
  adminEditTagGroupMenuItem,
  adminNewTagGroupMenuItem,
  adminTagGroupsCategory,
  adminTagGroupsMenuItem,
} from "../tag-group.menus";

export const adminTagGroupsMenuItemActions = [adminNewTagGroupMenuItem];
export const adminTagGroupMenuItemActions = [
  adminNewTagGroupMenuItem,
  adminEditTagGroupMenuItem,
  adminDeleteTagGroupMenuItem,
];

@Component({
  selector: "baw-admin-tag-groups-list",
  templateUrl: "./list.component.html",
})
class AdminTagGroupsComponent extends PagedTableTemplate<TableRow, TagGroup> {
  public columns = [{ name: "Tag" }, { name: "Group" }, { name: "Model" }];
  public sortKeys = { tag: "tagId", group: "groupIdentifier" };
  public editPath = adminEditTagGroupMenuItem.route;
  public deletePath = adminDeleteTagGroupMenuItem.route;

  public constructor(api: TagGroupsService) {
    super(api, (tagGroups) =>
      tagGroups.map((tagGroup) => ({
        tag: tagGroup.tagId,
        group: tagGroup.groupIdentifier,
        model: tagGroup,
      }))
    );

    this.filterKey = "groupIdentifier";
  }
}

AdminTagGroupsComponent.linkToRoute({
  category: adminTagGroupsCategory,
  pageRoute: adminTagGroupsMenuItem,
  menus: { actions: List(adminTagGroupsMenuItemActions) },
});

export { AdminTagGroupsComponent };

interface TableRow {
  tag: Id;
  group: string;
  model: TagGroup;
}
