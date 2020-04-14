import { Component, OnInit } from "@angular/core";
import { ScriptsService } from "@baw-api/scripts.service";
import {
  adminDashboardMenuItem,
  adminNewScriptsMenuItem,
  adminScriptsCategory,
  adminScriptsMenuItem,
} from "@component/admin/admin.menus";
import { Page } from "@helpers/page/pageDecorator";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { Id } from "@interfaces/apiInterfaces";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
import { Script } from "@models/Script";
import { List } from "immutable";

export const adminScriptsMenuItemActions = [adminNewScriptsMenuItem];

@Page({
  category: adminScriptsCategory,
  menus: {
    actions: List<AnyMenuItem>([
      adminDashboardMenuItem,
      ...adminScriptsMenuItemActions,
    ]),
    links: List(),
  },
  self: adminScriptsMenuItem,
})
@Component({
  selector: "app-admin-scripts",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})
export class AdminScriptsComponent extends PagedTableTemplate<
  TableRow,
  Script
> {
  public columns = [
    { name: "Name" },
    { name: "Version" },
    { name: "Id" },
    { name: "Command" },
  ];
  public sortKeys = {
    name: "name",
    version: "version",
    id: "id",
    command: "executableCommand",
  };
  public filterKey = "name";

  constructor(api: ScriptsService) {
    super(api, (scripts) =>
      scripts.map((script) => ({
        name: script.name,
        version: script.version,
        id: script.id,
        command: script.executableCommand,
      }))
    );
  }
}

interface TableRow {
  name: string;
  version: number;
  id: Id;
  command: string;
}
