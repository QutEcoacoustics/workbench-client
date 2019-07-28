import {
  ActionListTitle,
  ActionListTitleInterface
} from 'src/app/services/layout-menus/layout-menus.interface';

export class ProjectCollection implements ActionListTitle {
  getActionListTitle(): Readonly<ActionListTitleInterface> {
    return Object.freeze({
      icon: ['fas', 'globe-asia'],
      label: 'Project'
    });
  }
}
