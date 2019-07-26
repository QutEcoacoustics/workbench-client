import { Menus } from 'src/app/services/layout-menus/menus';
import { ActionMenuIcon, ActionMenuTitle } from '../../projects.menus';

export const ProjectsIcon: [string, string] = ['fas', 'globe-asia'];
export const menus: Menus = {
  action: {
    title: {
      icon: ActionMenuIcon,
      label: ActionMenuTitle
    },
    links: [
      {
        route: 'https://www.ecosounds.org/projects/new',
        icon: ['fas', 'plus'],
        label: 'New project',
        tooltip: 'Create a new project',
        predicate: loggedin => loggedin
      },
      {
        route: 'https://www.ecosounds.org/projects/new_access_request',
        icon: ['fas', 'key'],
        label: 'Request access',
        tooltip: 'Request access to a project not listed here',
        predicate: loggedin => loggedin
      }
    ]
  }
};
