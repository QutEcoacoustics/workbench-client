import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { accountResolvers } from '@baw-api/account/accounts.service';
import { Filters } from '@baw-api/baw-api.service';
import { ProjectsService } from '@baw-api/project/projects.service';
import {
  theirProfileCategory,
  theirProfileMenuItem,
  theirProjectsMenuItem,
} from '@components/profile/profile.menus';
import { PagedTableTemplate } from '@helpers/tableTemplate/pagedTableTemplate';
import { AnyMenuItem } from '@interfaces/menusInterfaces';
import { Project } from '@models/Project';
import { User } from '@models/User';
import { List } from 'immutable';
import { theirProfileActions } from '../profile/their-profile.component';

const accountKey = 'account';

@Component({
  selector: 'baw-their-projects',
  templateUrl: './projects.component.html',
})
class TheirProjectsComponent extends PagedTableTemplate<TableRow, Project> {
  public columns = [
    { name: 'Project' },
    { name: 'Sites' },
    { name: 'Permission' },
  ];
  protected api: ProjectsService;

  constructor(api: ProjectsService, route: ActivatedRoute) {
    super(
      api,
      (projects) =>
        projects.map((project) => ({
          project,
          sites: project.siteIds.size,
          permission: 'FIX ME',
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

TheirProjectsComponent.LinkComponentToPageInfo({
  category: theirProfileCategory,
  menus: {
    actions: List<AnyMenuItem>([theirProfileMenuItem, ...theirProfileActions]),
  },
  resolvers: { [accountKey]: accountResolvers.show },
}).AndMenuRoute(theirProjectsMenuItem);

export { TheirProjectsComponent };

interface TableRow {
  project: Project;
  sites: number;
  permission: string;
}
