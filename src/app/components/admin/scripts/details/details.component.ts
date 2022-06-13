import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { retrieveResolvers } from "@baw-api/resolver-common";
import { scriptResolvers } from "@baw-api/script/scripts.service";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import { permissionsWidgetMenuItem } from "@menu/widget.menus";
import { Script } from "@models/Script";
import { List } from "immutable";
import schema from "../script.schema.json";
import {
  adminEditScriptMenuItem,
  adminScriptMenuItem,
  adminScriptsCategory,
} from "../scripts.menus";

export const adminScriptActions = [adminEditScriptMenuItem];
const scriptKey = "script";

@Component({
  selector: "baw-admin-script",
  template: `
    <h1>Script Details</h1>
    <baw-detail-view [fields]="fields" [model]="script"></baw-detail-view>
  `,
})
class AdminScriptComponent extends PageComponent implements OnInit {
  public script: Script;
  public fields = schema.fields;

  public constructor(private route: ActivatedRoute) {
    super();
  }

  public ngOnInit(): void {
    const models = retrieveResolvers(this.route.snapshot.data as IPageInfo);
    this.script = models[scriptKey] as Script;
  }
}

AdminScriptComponent.linkToRoute({
  category: adminScriptsCategory,
  pageRoute: adminScriptMenuItem,
  menus: {
    actions: List(adminScriptActions),
    actionWidgets: List([permissionsWidgetMenuItem]),
  },
  resolvers: { [scriptKey]: scriptResolvers.show },
});

export { AdminScriptComponent };
