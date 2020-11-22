import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { accountResolvers } from '@baw-api/account/accounts.service';
import { Filters } from '@baw-api/baw-api.service';
import { ShallowSitesService } from '@baw-api/site/sites.service';
import {
  theirProfileCategory,
  theirProfileMenuItem,
  theirSitesMenuItem,
} from '@components/profile/profile.menus';
import { siteAnnotationsMenuItem } from '@components/sites/sites.menus';
import { PagedTableTemplate } from '@helpers/tableTemplate/pagedTableTemplate';
import { AnyMenuItem } from '@interfaces/menusInterfaces';
import { Site } from '@models/Site';
import { User } from '@models/User';
import { List } from 'immutable';
import { theirProfileActions } from '../profile/their-profile.component';

const accountKey = 'account';

@Component({
  selector: 'baw-their-sites',
  templateUrl: './sites.component.html',
})
class TheirSitesComponent extends PagedTableTemplate<TableRow, Site> {
  public columns = [
    { name: 'Site' },
    { name: 'Recent Audio Upload' },
    { name: 'Permission' },
    { name: 'Annotation' },
  ];
  protected api: ShallowSitesService;

  constructor(api: ShallowSitesService, route: ActivatedRoute) {
    // TODO Add missing details https://github.com/QutEcoacoustics/baw-server/issues/406
    super(
      api,
      (sites) =>
        sites.map((site) => ({
          site,
          recentAudioUpload: '(fix_me)',
          permission: 'FIX ME',
          annotation: siteAnnotationsMenuItem.uri(undefined),
        })),
      route
    );
  }

  public get account(): User {
    return this.models[accountKey] as User;
  }

  protected apiAction(filters: Filters) {
    return this.api.filterByCreator(filters, this.account);
  }
}

TheirSitesComponent.LinkComponentToPageInfo({
  category: theirProfileCategory,
  menus: {
    actions: List<AnyMenuItem>([theirProfileMenuItem, ...theirProfileActions]),
  },
  resolvers: { [accountKey]: accountResolvers.show },
}).AndMenuRoute(theirSitesMenuItem);

export { TheirSitesComponent };

interface TableRow {
  site: Site;
  recentAudioUpload: string;
  permission: string;
  annotation: string;
}
