import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  hasResolvedSuccessfully,
  retrieveResolvers,
} from "@baw-api/resolver-common";
import { scriptResolvers } from "@baw-api/script/scripts.service";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { permissionsWidgetMenuItem } from "@menu/widget.menus";
import { Script } from "@models/Script";
import { List } from "immutable";
import baseSchema from "../script.base.schema.json";
import extendedSchema from "../script.extended.schema.json";
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
    <div *ngIf="!failure">
      <h1>Script Details</h1>
      <baw-detail-view [fields]="fields" [model]="script"></baw-detail-view>
    </div>
  `,
})
class AdminScriptComponent
  extends withUnsubscribe(PageComponent)
  implements OnInit
{
  public script: Script;
  public failure: boolean;
  public fields = [...baseSchema.fields, ...extendedSchema.fields];

  public constructor(private route: ActivatedRoute) {
    super();
  }

  public ngOnInit(): void {
    const models = retrieveResolvers(this.route.snapshot.data as IPageInfo);

    if (!hasResolvedSuccessfully(models)) {
      this.failure = true;
      return;
    }

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
