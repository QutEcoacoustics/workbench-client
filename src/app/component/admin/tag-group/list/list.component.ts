import { Component, OnInit } from "@angular/core";
import { List } from "immutable";
import { Page } from "src/app/helpers/page/pageDecorator";
import { PagedTableTemplate } from "src/app/helpers/tableTemplate/pagedTableTemplate";
import { Id } from "src/app/interfaces/apiInterfaces";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { TagGroup } from "src/app/models/TagGroup";
import { TagGroupService } from "src/app/services/baw-api/tag-group.service";
import {
  adminDashboardMenuItem,
  adminDeleteTagGroupMenuItem,
  adminEditTagGroupMenuItem,
  adminNewTagGroupMenuItem,
  adminTagGroupsCategory,
  adminTagGroupsMenuItem
} from "../../admin.menus";

export const adminTagGroupsMenuItemActions = [adminNewTagGroupMenuItem];

@Page({
  category: adminTagGroupsCategory,
  menus: {
    actions: List<AnyMenuItem>([
      adminDashboardMenuItem,
      ...adminTagGroupsMenuItemActions
    ]),
    links: List()
  },
  self: adminTagGroupsMenuItem
})
@Component({
  selector: "app-admin-tag-groups-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"]
})
export class AdminTagGroupsComponent
  extends PagedTableTemplate<TableRow, TagGroup>
  implements OnInit {
  constructor(api: TagGroupService) {
    super(api, tagGroups =>
      tagGroups.map(tagGroup => ({
        tag: tagGroup.tagId,
        group: tagGroup.groupIdentifier,
        model: tagGroup
      }))
    );
  }

  ngOnInit(): void {
    this.columns = [{ name: "Tag" }, { name: "Group" }, { name: "Model" }];
    this.sortKeys = {
      tag: "tagId",
      group: "groupIdentifier"
    };

    this.getModels();
  }

  editPath(tagGroup: TagGroup): string {
    return adminEditTagGroupMenuItem.route
      .toString()
      .replace(":tagGroupId", tagGroup.id.toString());
  }

  deletePath(tag: TagGroup): string {
    return adminDeleteTagGroupMenuItem.route
      .toString()
      .replace(":tagGroupId", tag.id.toString());
  }
}

interface TableRow {
  tag: Id;
  group: string;
  model: TagGroup;
}
