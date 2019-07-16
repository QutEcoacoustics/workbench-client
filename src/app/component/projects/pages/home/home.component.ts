import { Component, OnInit } from '@angular/core';
import { List } from 'immutable';
import { Card } from 'src/app/component/shared/cards/cards.component';

@Component({
  selector: 'app-projects',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class ProjectsHomeComponent implements OnInit {
  projectList: List<Card>;

  constructor() {}

  ngOnInit() {
    this.projectList = List([
      {
        title: 'Tortuguero',
        image: {
          url:
            'https://www.ecosounds.org/system/projects/images/000/001/094/span3/5616960887_cf01ca55d2_b.jpg?1516664306',
          alt: 'Tortuguero'
        },
        description:
          'Soundscape recordings made in Turtuguero, Costa Rica, 2011.',
        link: 'https://www.ecosounds.org/projects/1094'
      },
      {
        title: 'Oxley Creek Common',
        image: {
          url:
            'https://www.ecosounds.org/system/projects/images/000/001/007/span3/IMG_20140529_111723_1_.jpg?1401329277',
          alt: 'Oxley Creek Common'
        },
        link: 'https://www.ecosounds.org/projects/1007'
      },
      {
        title: 'Cooloola',
        image: {
          url:
            'https://www.ecosounds.org/system/projects/images/000/001/029/span3/DSCN0286.JPG?1440543186',
          alt: 'Cooloola'
        },
        description: 'Sound recordings from the Gympie area.',
        link: 'https://www.ecosounds.org/projects/1029'
      }
    ]);
  }
}
