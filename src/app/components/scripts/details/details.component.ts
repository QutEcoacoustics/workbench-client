import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { hasResolvedSuccessfully, retrieveResolvers } from "@baw-api/resolver-common";
import { scriptResolvers } from "@baw-api/script/scripts.service";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { permissionsWidgetMenuItem } from "@menu/widget.menus";
import { Script } from "@models/Script";
import { List } from "immutable";
import baseSchema from "../script.base.schema.json";
import extendedSchema from "../script.extended.schema.json";
import { adminEditScriptMenuItem, scriptMenuItem, adminScriptsCategory } from "../scripts.menus";
import { DetailViewComponent } from "../../shared/detail-view/detail-view.component";

export const adminScriptActions = [adminEditScriptMenuItem];
const scriptKey = "script";

@Component({
  selector: "baw-admin-script",
  template: `
    @if (!failure) {
      <div>
        <h1>Script Details</h1>
        <baw-detail-view [fields]="fields" [model]="script"></baw-detail-view>
      </div>
    }
  `,
  imports: [DetailViewComponent],
})
class AdminScriptComponent extends withUnsubscribe(PageComponent) implements OnInit {
  public constructor(private route: ActivatedRoute) {
    super();
  }

  public script: Script;
  public failure: boolean;
  public fields = [...baseSchema.fields, ...extendedSchema.fields];

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
  pageRoute: scriptMenuItem,
  menus: {
    actions: List(adminScriptActions),
    actionWidgets: List([permissionsWidgetMenuItem]),
  },
  resolvers: { [scriptKey]: scriptResolvers.show },
});

export { AdminScriptComponent };
