import { Component, OnInit } from '@angular/core';
import { List } from 'immutable';
import { Card } from 'src/app/component/shared/cards/cards.component';
import { BawApiService } from 'src/app/services/baw-api/baw-api.service';

@Component({
  selector: 'app-projects',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class ProjectsComponent implements OnInit {
  projectList: List<Card>;
  secondaryLinks: {
    route: string;
    icon: [string, string];
    label: string;
    tooltip: string;
  }[];
  actionTitle: {
    icon: [string, string];
    label: string;
  };
  actionLinks: {
    route: string;
    icon: [string, string];
    label: string;
  }[];

  constructor(private api: BawApiService) {}

  ngOnInit() {
    this.projectList = List([
      {
        title: 'Lorem ipsum',
        image: {
          url:
            'https://www.ecosounds.org/system/projects/images/000/001/094/span3/5616960887_cf01ca55d2_b.jpg?1516664306',
          alt: 'Lorem ipsum'
        },
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ',
        link: 'https://www.ecosounds.org/projects/1094'
      },
      {
        title: 'Lorem ipsum',
        image: {
          url:
            'https://www.ecosounds.org/system/projects/images/000/001/007/span3/IMG_20140529_111723_1_.jpg?1401329277',
          alt: 'Oxley Creek Common'
        },
        link: 'https://www.ecosounds.org/projects/1007'
      },
      {
        title: 'Lorem ipsum',
        image: {
          url:
            'https://www.ecosounds.org/system/projects/images/000/001/029/span3/DSCN0286.JPG?1440543186',
          alt: 'Lorem ipsum'
        },
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ',
        link: 'https://www.ecosounds.org/projects/1029'
      },
      {
        title: 'Lorem ipsum',
        image: {
          url:
            'https://www.ecosounds.org/system/projects/images/000/001/094/span3/5616960887_cf01ca55d2_b.jpg?1516664306',
          alt: 'Lorem ipsum'
        },
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ',
        link: 'https://www.ecosounds.org/projects/1094'
      },
      {
        title: 'Lorem ipsum',
        image: {
          url:
            'https://www.ecosounds.org/system/projects/images/000/001/007/span3/IMG_20140529_111723_1_.jpg?1401329277',
          alt: 'Oxley Creek Common'
        },
        link: 'https://www.ecosounds.org/projects/1007'
      },
      {
        title: 'Lorem ipsum',
        image: {
          url:
            'https://www.ecosounds.org/system/projects/images/000/001/029/span3/DSCN0286.JPG?1440543186',
          alt: 'Lorem ipsum'
        },
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ',
        link: 'https://www.ecosounds.org/projects/1029'
      },
      {
        title: 'Lorem ipsum',
        image: {
          url:
            'https://www.ecosounds.org/system/projects/images/000/001/094/span3/5616960887_cf01ca55d2_b.jpg?1516664306',
          alt: 'Lorem ipsum'
        },
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ',
        link: 'https://www.ecosounds.org/projects/1094'
      },
      {
        title: 'Lorem ipsum',
        image: {
          url:
            'https://www.ecosounds.org/system/projects/images/000/001/007/span3/IMG_20140529_111723_1_.jpg?1401329277',
          alt: 'Oxley Creek Common'
        },
        link: 'https://www.ecosounds.org/projects/1007'
      },
      {
        title: 'Lorem ipsum',
        image: {
          url:
            'https://www.ecosounds.org/system/projects/images/000/001/029/span3/DSCN0286.JPG?1440543186',
          alt: 'Lorem ipsum'
        },
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ',
        link: 'https://www.ecosounds.org/projects/1029'
      }
    ]);
    this.secondaryLinks = [
      {
        route: '/',
        icon: ['fas', 'home'],
        label: 'Home',
        tooltip: 'Home page'
      },
      {
        route: '/login',
        icon: ['fas', 'sign-in-alt'],
        label: 'Log in',
        tooltip: 'View profile'
      },
      {
        route: '/register',
        icon: ['fas', 'user-plus'],
        label: 'Register',
        tooltip: 'View my recent annotations'
      },
      {
        route: '/projects',
        icon: ['fas', 'globe-asia'],
        label: 'Projects',
        tooltip: 'View projects I have access too'
      },
      {
        route: '/audio_analysis',
        icon: ['fas', 'server'],
        label: 'Audio Analysis',
        tooltip: 'View audio analysis jobs'
      },
      {
        route: '/library',
        icon: ['fas', 'book'],
        label: 'Library',
        tooltip: 'Annotation library'
      },
      {
        route: '/data_request',
        icon: ['fas', 'table'],
        label: 'Data Request',
        tooltip: 'Request customized data from the website'
      },
      {
        route: '/send_audio',
        icon: ['fas', 'envelope'],
        label: 'Send Audio',
        tooltip: 'Send us audio recordings to upload'
      },
      {
        route: '/about/report',
        icon: ['fas', 'bug'],
        label: 'Report Problem',
        tooltip: 'Report a problem with the website'
      },
      {
        route: '/statistics',
        icon: ['fas', 'chart-line'],
        label: 'Statistics',
        tooltip: 'Annotation and audio recording stats'
      }
    ];
    this.actionTitle = { icon: ['fas', 'globe-asia'], label: 'Projects' };

    if (this.api.loggedIn) {
      this.actionLinks = [
        {
          route: 'https://www.ecosounds.org/projects/new',
          icon: ['fas', 'plus'],
          label: 'New project'
        },
        {
          route: 'https://www.ecosounds.org/projects/new_access_request',
          icon: ['fas', 'key'],
          label: 'Request access'
        }
      ];
    }
  }
}
