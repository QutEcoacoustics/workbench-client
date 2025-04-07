import { Component, OnInit } from "@angular/core";
import { ScriptsService } from "@baw-api/script/scripts.service";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { Id } from "@interfaces/apiInterfaces";
import { Script } from "@models/Script";
import { List } from "immutable";
import { BawSessionService } from "@baw-api/baw-session.service";
import { User } from "@models/User";
import {
  adminEditScriptMenuItem,
  newScriptMenuItem,
  adminScriptsCategory,
  scriptsMenuItem,
} from "../scripts.menus";

export const adminScriptsMenuItemActions = [newScriptMenuItem];

@Component({
  selector: "baw-scripts",
  templateUrl: "./list.component.html",
  standalone: false
})
class AdminScriptsComponent
  extends PagedTableTemplate<TableRow, Script>
  implements OnInit
{
  public constructor(
    protected api: ScriptsService,
    protected session: BawSessionService
  ) {
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
  };

  public updatePath = adminEditScriptMenuItem.route;
  protected user?: User;
}

AdminScriptsComponent.linkToRoute({
  category: adminScriptsCategory,
  pageRoute: scriptsMenuItem,
  menus: { actions: List(adminScriptsMenuItemActions) },
});

export { AdminScriptsComponent };

interface TableRow {
  name: string;
  version: number;
  id: Id;
  command: string;
  model: Script;
}
