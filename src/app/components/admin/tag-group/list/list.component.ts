import { Component } from "@angular/core";
import { TagGroupsService } from "@baw-api/tag/tag-group.service";
import { adminDashboardMenuItem } from "@components/admin/admin.menus";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { Id } from "@interfaces/apiInterfaces";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
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
  styleUrls: ["./list.component.scss"],
})
class AdminTagGroupsComponent extends PagedTableTemplate<TableRow, TagGroup> {
  public columns = [{ name: "Tag" }, { name: "Group" }, { name: "Model" }];
  public sortKeys = {
    tag: "tagId",
    group: "groupIdentifier",
  };

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

  public editPath(tagGroup: TagGroup): string {
    return adminEditTagGroupMenuItem.route
      .toString()
      .replace(":tagGroupId", tagGroup.id.toString());
  }

  public deletePath(tag: TagGroup): string {
    return adminDeleteTagGroupMenuItem.route
      .toString()
      .replace(":tagGroupId", tag.id.toString());
  }
}

AdminTagGroupsComponent.LinkComponentToPageInfo({
  category: adminTagGroupsCategory,
  menus: {
    actions: List<AnyMenuItem>([
      adminDashboardMenuItem,
      ...adminTagGroupsMenuItemActions,
    ]),
  },
}).AndMenuRoute(adminTagGroupsMenuItem);

export { AdminTagGroupsComponent };

interface TableRow {
  tag: Id;
  group: string;
  model: TagGroup;
}
