import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  hasResolvedSuccessfully,
  retrieveResolvers,
} from "@baw-api/resolver-common";
import { shallowSiteResolvers } from "@baw-api/site/sites.service";
import baseSchema from "@components/sites/site.base.json";
import extendedSchema from "@components/sites/site.extended.json";
import { PageComponent } from "@helpers/page/pageComponent";
import { PageInfo } from "@helpers/page/pageInfo";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { PermissionsShieldComponent } from "@menu/permissions-shield.component";
import { WidgetMenuItem } from "@menu/widgetItem";
import { Site } from "@models/Site";
import { List } from "immutable";
import {
  adminOrphanMenuItem,
  adminOrphansCategory,
  adminOrphansMenuItem,
} from "../orphans.menus";

const siteKey = "site";

@Component({
  selector: "baw-admin-orphan",
  template: `
    <div *ngIf="!failure">
      <h1>Orphan Site Details</h1>
      <baw-detail-view [fields]="fields" [model]="site"></baw-detail-view>
    </div>
  `,
})
class AdminOrphanComponent
  extends withUnsubscribe(PageComponent)
  implements OnInit
{
  public site: Site;
  public failure: boolean;
  public fields = [...baseSchema.fields, ...extendedSchema.fields];

  public constructor(private route: ActivatedRoute) {
    super();
  }

  public ngOnInit(): void {
    const models = retrieveResolvers(this.route.snapshot.data as PageInfo);

    if (!hasResolvedSuccessfully(models)) {
      this.failure = true;
      return;
    }

    this.site = models[siteKey] as Site;
  }
}

AdminOrphanComponent.linkComponentToPageInfo({
  category: adminOrphansCategory,
  menus: {
    actions: List([adminOrphansMenuItem, adminOrphanMenuItem]),
    actionWidgets: List([new WidgetMenuItem(PermissionsShieldComponent)]),
  },
  resolvers: { [siteKey]: shallowSiteResolvers.show },
}).andMenuRoute(adminOrphanMenuItem);

export { AdminOrphanComponent };
