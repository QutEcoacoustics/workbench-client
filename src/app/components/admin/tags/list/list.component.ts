import { Component } from "@angular/core";
import { TagsService } from "@baw-api/tag/tags.service";
import { adminDashboardMenuItem } from "@components/admin/admin.menus";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
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
  selector: "app-admin-tags",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
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

  constructor(api: TagsService) {
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

  public editPath(tag: Tag): string {
    return adminEditTagMenuItem.route
      .toString()
      .replace(":tagId", tag.id.toString());
  }

  public deletePath(tag: Tag): string {
    return adminDeleteTagMenuItem.route
      .toString()
      .replace(":tagId", tag.id.toString());
  }
}

AdminTagsComponent.LinkComponentToPageInfo({
  category: adminTagsCategory,
  menus: {
    actions: List<AnyMenuItem>([
      adminDashboardMenuItem,
      ...adminTagsMenuItemActions,
    ]),
  },
}).AndMenuRoute(adminTagsMenuItem);

export { AdminTagsComponent };

interface TableRow {
  text: string;
  taxonomic: "Taxonomic" | "Folksonomic";
  retired: boolean;
  type: string;
  tag: Tag;
}
