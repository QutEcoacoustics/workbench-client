import { Component } from "@angular/core";
import { TagsService } from "@baw-api/tag/tags.service";
import { adminDashboardMenuItem } from "@components/admin/admin.menus";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { Tag } from "@models/Tag";
import { List } from "immutable";
import {
  adminDeleteTagMenuItem,
  adminEditTagMenuItem,
  adminNewTagMenuItem,
  adminTagsCategory,
  adminTagsMenuItem,
} from "../tags.menus";

export const adminTagsMenuItemActions = [adminNewTagMenuItem];

@Component({
  selector: "baw-admin-tags",
  templateUrl: "./list.component.html",
})
class AdminTagsComponent extends PagedTableTemplate<TableRow, Tag> {
  public columns = [
    { name: "Text" },
    { name: "Taxonomic" },
    { name: "Retired" },
    { name: "type" },
    { name: "Tag" },
  ];
  public sortKeys = {
    text: "text",
    taxonomic: "isTaxonomic",
    retired: "retired",
    type: "typeOfTag",
  };
  public editPath = adminEditTagMenuItem.route;
  public deletePath = adminDeleteTagMenuItem.route;

  public constructor(api: TagsService) {
    super(api, (tags) =>
      tags.map((tag) => ({
        text: tag.text,
        taxonomic: tag.isTaxonomic ? "Taxonomic" : "Folksonomic",
        retired: tag.retired,
        type: tag.typeOfTag,
        tag,
      }))
    );

    this.filterKey = "text";
  }
}

AdminTagsComponent.linkComponentToPageInfo({
  category: adminTagsCategory,
  menus: {
    actions: List([adminDashboardMenuItem, ...adminTagsMenuItemActions]),
  },
}).andMenuRoute(adminTagsMenuItem);

export { AdminTagsComponent };

interface TableRow {
  text: string;
  taxonomic: "Taxonomic" | "Folksonomic";
  retired: boolean;
  type: string;
  tag: Tag;
}
