import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { retrieveResolvers } from "@baw-api/resolver-common";
import { shallowSiteResolvers } from "@baw-api/site/sites.service";
import schema from "@components/sites/site.schema.json";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import { permissionsWidgetMenuItem } from "@menu/widget.menus";
import { Site } from "@models/Site";
import { List } from "immutable";
import { adminOrphanMenuItem, adminOrphansCategory } from "../orphans.menus";

const siteKey = "site";

@Component({
  selector: "baw-admin-orphan",
  template: `
    <h1>Orphan Site Details</h1>
    <baw-detail-view [fields]="fields" [model]="site"></baw-detail-view>
  `,
})
class AdminOrphanComponent extends PageComponent implements OnInit {
  public site: Site;
  public fields = schema.fields;

  public constructor(private route: ActivatedRoute) {
    super();
  }

  public ngOnInit(): void {
    const models = retrieveResolvers(this.route.snapshot.data as IPageInfo);
    this.site = models[siteKey] as Site;
  }
}

AdminOrphanComponent.linkToRoute({
  category: adminOrphansCategory,
  pageRoute: adminOrphanMenuItem,
  menus: {
    actions: List([adminOrphanMenuItem]),
    actionWidgets: List([permissionsWidgetMenuItem]),
  },
  resolvers: { [siteKey]: shallowSiteResolvers.show },
});

export { AdminOrphanComponent };
