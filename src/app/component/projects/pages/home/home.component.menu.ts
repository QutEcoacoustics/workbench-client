import { ProjectCollection } from '../../projects.menus';
import {
  LayoutMenusInterface,
  Href
} from 'src/app/services/layout-menus/layout-menus.interface';

export const ProjectsIcon: [string, string] = ['fas', 'globe-asia'];
export const menus: LayoutMenusInterface = {
  action: {
    list_title: ProjectCollection.prototype.getActionListTitle(),
    links: [
      {
        uri: new Href('https://www.ecosounds.org/projects/new'),
        icon: ['fas', 'plus'],
        label: 'New project',
        tooltip: 'Create a new project',
        predicate: loggedin => loggedin
      },
      {
        uri: new Href('https://www.ecosounds.org/projects/new_access_request'),
        icon: ['fas', 'key'],
        label: 'Request access',
        tooltip: 'Request access to a project not listed here',
        predicate: loggedin => loggedin
      }
    ]
  }
};
