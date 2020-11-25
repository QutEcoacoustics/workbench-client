import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { retrieveResolvers } from "@baw-api/resolver-common";
import { scriptResolvers } from "@baw-api/script/scripts.service";
import { PageComponent } from "@helpers/page/pageComponent";
import { PageInfo } from "@helpers/page/pageInfo";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { PermissionsShieldComponent } from "@menu/permissions-shield.component";
import { WidgetMenuItem } from "@menu/widgetItem";
import { Script } from "@models/Script";
import { List } from "immutable";
import { fields as baseFields } from "../script.base.schema.json";
import { fields as extendedFields } from "../script.extended.schema.json";
import {
  adminEditScriptMenuItem,
  adminScriptMenuItem,
  adminScriptsCategory,
  adminScriptsMenuItem,
} from "../scripts.menus";

export const adminScriptActions = [adminEditScriptMenuItem];
const scriptKey = "script";

@Component({
  selector: "baw-admin-script",
  template: `
    <div *ngIf="!failure">
      <h1>Script Details</h1>
      <baw-detail-view [fields]="fields" [model]="script"></baw-detail-view>
    </div>
  `,
})
class AdminScriptComponent
  extends withUnsubscribe(PageComponent)
  implements OnInit {
  public script: Script;
  public failure: boolean;
  public fields = [...baseFields, ...extendedFields];

  public constructor(private route: ActivatedRoute) {
    super();
  }

  public ngOnInit(): void {
    const models = retrieveResolvers(this.route.snapshot.data as PageInfo);

    if (!models) {
      this.failure = true;
      return;
    }

    this.script = models[scriptKey] as Script;
  }
}

AdminScriptComponent.linkComponentToPageInfo({
  category: adminScriptsCategory,
  menus: {
    actions: List([adminScriptsMenuItem, ...adminScriptActions]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
  },
  resolvers: { [scriptKey]: scriptResolvers.show },
}).andMenuRoute(adminScriptMenuItem);

export { AdminScriptComponent };
