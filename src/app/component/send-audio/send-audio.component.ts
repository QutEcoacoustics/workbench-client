import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  SecondaryLink,
  LayoutMenus,
  LayoutMenusInterface,
  SecondaryLinkInterface,
  Route
} from 'src/app/services/layout-menus/layout-menus.interface';

@Component({
  selector: 'app-send-audio',
  templateUrl: './send-audio.component.html',
  styleUrls: ['./send-audio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SendAudioComponent implements OnInit, SecondaryLink, LayoutMenus {
  constructor() {}

  ngOnInit() {}

  getMenus(): Readonly<LayoutMenusInterface> {
    return undefined;
  }
  getSecondaryItem(): Readonly<SecondaryLinkInterface> {
    return Object.freeze({
      icon: ['fas', 'envelope'],
      label: 'Send Audio',
      uri: new Route('/send_audio'),
      tooltip: 'Send us audio recordings to upload'
    });
  }
}
