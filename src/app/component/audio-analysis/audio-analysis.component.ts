import { Component, OnInit } from '@angular/core';
import {
  SecondaryLink,
  LayoutMenus,
  Route,
  LayoutMenusInterface,
  SecondaryLinkInterface
} from 'src/app/services/layout-menus/layout-menus.interface';

@Component({
  selector: 'app-audio-analysis',
  templateUrl: './audio-analysis.component.html',
  styleUrls: ['./audio-analysis.component.scss']
})
export class AudioAnalysisComponent
  implements OnInit, SecondaryLink, LayoutMenus {
  constructor() {}

  ngOnInit() {
    document.location.href = 'https://staging.ecosounds.org/audio_analysis';
  }

  getSecondaryItem(): Readonly<SecondaryLinkInterface> {
    return Object.freeze({
      uri: new Route('/audio_analysis'),
      icon: ['fas', 'server'],
      label: 'Audio Analysis',
      tooltip: 'View audio analysis jobs'
    });
  }
  getMenus(): LayoutMenusInterface {
    return undefined;
  }
}
