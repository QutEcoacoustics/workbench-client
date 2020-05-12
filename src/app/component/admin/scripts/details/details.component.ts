import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { retrieveResolvers } from "@baw-api/resolver-common";
import { scriptResolvers } from "@baw-api/script/scripts.service";
import { PageComponent } from "@helpers/page/pageComponent";
import { Page } from "@helpers/page/pageDecorator";
import { WithUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { Script } from "@models/Script";
import { List } from "immutable";
import { fields as baseFields } from "../script.base.schema.json";
import { fields as extendedFields } from "../script.extended.schema.json";
import {
  adminEditScriptMenuItem,
  adminNewScriptsMenuItem,
  adminScriptMenuItem,
  adminScriptsCategory,
  adminScriptsMenuItem,
} from "../scripts.menus";

export const adminScriptActions = [
  adminNewScriptsMenuItem,
  adminEditScriptMenuItem,
];
const scriptKey = "script";

@Page({
  category: adminScriptsCategory,
  menus: {
    links: List(),
    actions: List([adminScriptsMenuItem, ...adminScriptActions]),
  },
  resolvers: {
    [scriptKey]: scriptResolvers.show,
  },
  self: adminScriptMenuItem,
})
@Component({
  selector: "app-admin-script",
  template: `
    <div *ngIf="!failure">
      <h1>Orphan Site Details</h1>
      <baw-detail-view [fields]="fields" [model]="site"></baw-detail-view>
    </div>
  `,
})
export class AdminScriptComponent extends WithUnsubscribe(PageComponent)
  implements OnInit {
  public site: Script;
  public failure: boolean;
  public fields = [...baseFields, ...extendedFields];

  constructor(private route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    const data = this.route.snapshot.data;
    const models = retrieveResolvers(data);

    if (!models) {
      this.failure = true;
      return;
    }

    this.site = models[scriptKey] as Script;
  }
}
