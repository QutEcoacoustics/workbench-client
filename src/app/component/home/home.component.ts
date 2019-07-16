import { Component, OnInit } from '@angular/core';
import { List } from 'immutable';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  processList: List<{
    title: string;
    image?: { url: string; alt: string };
    description?: string;
    link?: string;
  }>;
  projectList: List<{
    title: string;
    image?: { url: string; alt: string };
    description?: string;
    link?: string;
  }>;
  postList: List<{
    title: string;
    image?: { url: string; alt: string };
    description?: string;
    link?: string;
  }>;
  testing: string;

  constructor() {}

  ngOnInit() {
    this.processList = List([
      {
        title: 'Environment',
        description:
          'Faunal vocalisations and other human-audible environmental sounds'
      },
      {
        title: 'Acoustic Sensors',
        description:
          'Acoustic sensors record sound in a wide range of environments'
      },
      {
        title: 'Annotated Spectrogram',
        description:
          'Practical identification of animal sounds by people and automated detectors. Ecologists use these to answer environmental questions.'
      }
    ]);
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

    this.postList = List();
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => response.json())
      .then(json =>
        json.map(
          (row: {
            userId: Number;
            id: Number;
            title: string;
            body: string;
          }) => {
            return { title: row.title, description: row.body };
          }
        )
      )
      .then(posts => {
        this.postList = List(posts);
      });
  }
}
