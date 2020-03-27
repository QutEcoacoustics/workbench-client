import { Component, OnInit } from "@angular/core";
import { List } from "immutable";
import { Page } from "src/app/helpers/page/pageDecorator";
import { PagedTableTemplate } from "src/app/helpers/tableTemplate/pagedTableTemplate";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { Tag } from "src/app/models/Tag";
import { TagsService } from "src/app/services/baw-api/tags.service";
import {
  adminDashboardMenuItem,
  adminDeleteTagMenuItem,
  adminEditTagMenuItem,
  adminNewTagMenuItem,
  adminTagsCategory,
  adminTagsMenuItem
} from "../../admin.menus";

export const adminTagsMenuItemActions = [
  adminNewTagMenuItem,
  adminEditTagMenuItem,
  adminDeleteTagMenuItem
];

@Page({
  category: adminTagsCategory,
  menus: {
    actions: List<AnyMenuItem>([
      adminDashboardMenuItem,
      ...adminTagsMenuItemActions
    ]),
    links: List()
  },
  self: adminTagsMenuItem
})
@Component({
  selector: "app-admin-tags",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"]
})
export class AdminTagsComponent extends PagedTableTemplate<TableRow, Tag>
  implements OnInit {
  constructor(api: TagsService) {
    super(api, tags =>
      tags.map(tag => ({
        text: tag.text,
        count: tag.count,
        taxanomic: tag.isTaxanomic ? "Taxanomic" : "Folksonomic",
        retired: tag.retired,
        type: tag.typeOfTag,
        tag
      }))
    );
  }

  ngOnInit(): void {
    this.columns = [
      { name: "Text" },
      { name: "Count" },
      { name: "Taxanomic" },
      { name: "Retired" },
      { name: "type" },
      { name: "Tag" }
    ];
    this.sortKeys = {
      text: "text",
      taxanomic: "isTaxanomic",
      retired: "retired",
      type: "typeOfTag"
    };

    this.getModels();
  }

  editPath(tag: Tag): string {
    return adminEditTagMenuItem.route
      .toString()
      .replace(":tagId", tag.id.toString());
  }

  deletePath(tag: Tag): string {
    return adminDeleteTagMenuItem.route
      .toString()
      .replace(":tagId", tag.id.toString());
  }
}

interface TableRow {
  text: string;
  count: number;
  taxanomic: "Taxanomic" | "Folksonomic";
  retired: boolean;
  type: string;
  tag: Tag;
}
