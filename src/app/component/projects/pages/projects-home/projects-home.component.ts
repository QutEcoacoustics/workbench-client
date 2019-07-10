import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-projects-home',
  templateUrl: './projects-home.component.html',
  styleUrls: ['./projects-home.component.scss']
})
export class ProjectsHomeComponent implements OnInit {
  processList: { title: string; description?: string }[];

  constructor() {}

  ngOnInit() {
    this.processList = [
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
    ];
  }
}
