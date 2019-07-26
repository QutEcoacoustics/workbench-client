import {
  HomeIcon,
  ActionMenuTitle
} from 'src/app/component/home/home.component.menu';
import { AuthenticationLoginIcon } from 'src/app/component/authentication/pages/login/login.component.menus';
import { AuthenticationRegisterIcon } from 'src/app/component/authentication/pages/register/register.component.menus';
import { ProfileIcon } from 'src/app/component/profile/pages/home/home.component.menus';
import { AudioAnalysisIcon } from 'src/app/component/audio-analysis/audio-analysis.component.menus';
import { AboutReportIcon } from 'src/app/component/about/pages/report/report.component.menus';
import { LibraryIcon } from 'src/app/component/library/pages/home/home.component.menu';
import { DataRequestIcon } from 'src/app/component/data-request/data-request.component.menus';
import { ProjectsIcon } from 'src/app/component/projects/pages/home/home.component.menu';
import { SendAudioIcon } from 'src/app/component/send-audio/send-audio.component.menu';
import { WebStatisticsIcon } from 'src/app/component/web-statistics/web-statistics.component.menu';

export const menus: Menus = {
  secondary: {
    links: [
      {
        route: '/home',
        icon: HomeIcon,
        label: 'Home',
        tooltip: 'Home page'
      },
      {
        route: '/login',
        icon: AuthenticationLoginIcon,
        label: 'Log in',
        tooltip: 'Log into the website',
        predicate: loggedin => !loggedin
      },
      {
        route: '/register',
        icon: AuthenticationRegisterIcon,
        label: 'Register',
        tooltip: 'Create an account',
        predicate: loggedin => !loggedin
      },
      {
        route: '/profile',
        icon: ProfileIcon,
        label: 'My Profile',
        tooltip: 'View profile',
        predicate: loggedin => loggedin
      },
      {
        route: 'https://www.ecosounds.org/user_accounts/741/audio_events',
        icon: ['fas', 'list'],
        label: 'My Annotations',
        tooltip: 'View my recent annotations',
        predicate: loggedin => loggedin
      },
      {
        route: '/projects',
        icon: ProjectsIcon,
        label: 'Projects',
        tooltip: 'View projects I have access too'
      },
      {
        route: '/audio_analysis',
        icon: AudioAnalysisIcon,
        label: 'Audio Analysis',
        tooltip: 'View audio analysis jobs'
      },
      {
        route: '/library',
        icon: LibraryIcon,
        label: 'Library',
        tooltip: 'Annotation library'
      },
      {
        route: '/data_request',
        icon: DataRequestIcon,
        label: 'Data Request',
        tooltip: 'Request customized data from the website'
      },
      {
        route: '/send_audio',
        icon: SendAudioIcon,
        label: 'Send Audio',
        tooltip: 'Send us audio recordings to upload'
      },
      {
        route: '/about/report',
        icon: AboutReportIcon,
        label: 'Report Problem',
        tooltip: 'Report a problem with the website'
      },
      {
        route: '/statistics',
        icon: WebStatisticsIcon,
        label: 'Statistics',
        tooltip: 'Annotation and audio recording stats'
      }
    ]
  },
  action: {
    title: { icon: HomeIcon, label: ActionMenuTitle },
    links: []
  }
};

export interface Menus {
  secondary?: SecondaryMenu;
  action?: ActionMenu;
}
export interface SecondaryMenu {
  links: Link[];
}
export interface ActionMenu {
  title?: ActionTitle;
  links: Link[];
}
export interface ActionTitle {
  icon: [string, string];
  label: string;
}

export interface Link {
  route: string;
  icon: [string, string];
  label: string;
  tooltip: string;
  predicate?: (user: boolean) => boolean;
}
