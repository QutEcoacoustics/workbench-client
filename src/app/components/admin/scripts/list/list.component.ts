import { Component } from "@angular/core";
import { ScriptsService } from "@baw-api/script/scripts.service";
import { adminDashboardMenuItem } from "@components/admin/admin.menus";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { Id } from "@interfaces/apiInterfaces";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
import { Script } from "@models/Script";
import { List } from "immutable";
import {
  adminEditScriptMenuItem,
  adminNewScriptsMenuItem,
  adminScriptsCategory,
  adminScriptsMenuItem,
} from "../scripts.menus";

export const adminScriptsMenuItemActions = [adminNewScriptsMenuItem];

@Component({
  selector: "baw-admin-scripts",
  templateUrl: "./list.component.html",
})
class AdminScriptsComponent extends PagedTableTemplate<TableRow, Script> {
  public columns = [
    { name: "Name" },
    { name: "Version" },
    { name: "Id" },
    { name: "Command" },
    { name: "Model" },
  ];
  public sortKeys = {
    name: "name",
    version: "version",
    id: "id",
    command: "executableCommand",
  };

  constructor(api: ScriptsService) {
    super(api, (scripts) =>
      scripts.map((script) => ({
        name: script.name,
        version: script.version,
        id: script.id,
        command: script.executableCommand,
        model: script,
      }))
    );

    this.filterKey = "name";
  }

  public updatePath(model: Script): string {
    return adminEditScriptMenuItem.route.format({ scriptId: model.id });
  }
}

AdminScriptsComponent.LinkComponentToPageInfo({
  category: adminScriptsCategory,
  menus: {
    actions: List<AnyMenuItem>([
      adminDashboardMenuItem,
      ...adminScriptsMenuItemActions,
    ]),
  },
}).AndMenuRoute(adminScriptsMenuItem);

export { AdminScriptsComponent };

interface TableRow {
  name: string;
  version: number;
  id: Id;
  command: string;
  model: Script;
}
