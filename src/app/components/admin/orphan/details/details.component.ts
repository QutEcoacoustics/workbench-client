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
import { IPageInfo } from "@helpers/page/pageInfo";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { permissionsWidgetMenuItem } from "@menu/widget.menus";
import { Site } from "@models/Site";
import { List } from "immutable";
import { DetailViewComponent } from "@shared/detail-view/detail-view.component";
import { adminOrphanMenuItem, adminOrphansCategory } from "../orphans.menus";

const siteKey = "site";

@Component({
  selector: "baw-admin-orphan",
  template: `
    @if (!failure) {
    <div>
      <h1>Orphan Site Details</h1>
      <baw-detail-view [fields]="fields" [model]="site"></baw-detail-view>
    </div>
    }
  `,
  imports: [DetailViewComponent],
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
    const models = retrieveResolvers(this.route.snapshot.data as IPageInfo);

    if (!hasResolvedSuccessfully(models)) {
      this.failure = true;
      return;
    }

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
