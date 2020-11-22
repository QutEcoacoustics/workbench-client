import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { projectResolvers } from '@baw-api/project/projects.service';
import { ShallowSitesService } from '@baw-api/site/sites.service';
import {
  assignSiteMenuItem,
  projectCategory,
  projectMenuItem,
} from '@components/projects/projects.menus';
import { PagedTableTemplate } from '@helpers/tableTemplate/pagedTableTemplate';
import { AnyMenuItem } from '@interfaces/menusInterfaces';
import { PermissionsShieldComponent } from '@menu/permissions-shield.component';
import { WidgetMenuItem } from '@menu/widgetItem';
import { Project } from '@models/Project';
import { Site } from '@models/Site';
import { List } from 'immutable';
import { projectMenuItemActions } from '../details/details.component';

const projectKey = 'project';

@Component({
  selector: 'baw-assign',
  templateUrl: './assign.component.html',
  styleUrls: ['./assign.component.scss'],
})
class AssignComponent extends PagedTableTemplate<TableRow, Site> {
  // TODO Move this back into the admin dashboard
  public columns = [
    { name: 'Site Id' },
    { name: 'Name' },
    { name: 'Description' },
  ];
  public sortKeys = {
    siteId: 'id',
    name: 'name',
    description: 'descriptionHtmlTagline',
  };

  constructor(api: ShallowSitesService, route: ActivatedRoute) {
    super(
      api,
      (sites) =>
        sites.map((site) => ({
          siteId: site.id,
          name: site.name,
          description: site.descriptionHtmlTagline,
        })),
      route
    );

    this.filterKey = 'name';
  }

  public get project(): Project {
    return this.models.project as Project;
  }

  public onSelect(event) {
    console.log('Select: ', event);
  }
}

AssignComponent.LinkComponentToPageInfo({
  category: projectCategory,
  menus: {
    actions: List<AnyMenuItem>([projectMenuItem, ...projectMenuItemActions]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
  },
  resolvers: { [projectKey]: projectResolvers.show },
}).AndMenuRoute(assignSiteMenuItem);

export { AssignComponent };

interface TableRow {
  siteId: number;
  name: string;
  description: string;
}
