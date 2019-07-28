import { ProfileCollection } from '../../profile.menus';
import {
  LayoutMenusInterface,
  Href
} from 'src/app/services/layout-menus/layout-menus.interface';

export const menus: LayoutMenusInterface = {
  action: {
    list_title: ProfileCollection.prototype.getActionListTitle(),
    links: [
      {
        uri: new Href('https://www.ecosounds.org/my_account/edit'),
        icon: ['fas', 'edit'],
        label: 'Edit my profile',
        tooltip: 'Change the details for this profile',
        predicate: loggedin => loggedin
      },
      {
        uri: new Href('https://staging.ecosounds.org/user_accounts/1/projects'),
        icon: ['fas', 'globe-asia'],
        label: 'My Projects',
        tooltip: 'Projects Admin can access',
        predicate: loggedin => loggedin
      },
      {
        uri: new Href('https://www.ecosounds.org/user_accounts/741/sites'),
        icon: ['fas', 'map-marker-alt'],
        label: 'My Sites',
        tooltip: 'Sites Admin can access',
        predicate: loggedin => loggedin
      },
      {
        uri: new Href(
          'https://staging.ecosounds.org/user_accounts/1/bookmarks'
        ),
        icon: ['fas', 'bookmark'],
        label: 'My Bookmarks',
        tooltip: 'Sites Admin can access',
        predicate: loggedin => loggedin
      },
      {
        uri: new Href(
          'https://staging.ecosounds.org/user_accounts/1/audio_events'
        ),
        icon: ['fas', 'list'],
        label: 'My Annotations',
        tooltip: 'Sites Admin can access',
        predicate: loggedin => loggedin
      }
    ]
  }
};
