import { Component, OnInit } from '@angular/core';
import { List } from 'immutable';
import { Card } from 'src/app/component/shared/cards/cards.component';
import { AppSettingsService } from 'src/app/services/app-settings/app-settings.service';

@Component({
  selector: 'app-projects',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class ProjectsComponent implements OnInit {
  projectList: List<Card>;

  constructor(private settings: AppSettingsService) {}

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
  }
}
