import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  OnDestroy
} from '@angular/core';

@Component({
  selector: 'app-listen',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListenComponent implements OnInit, OnDestroy {
  imageUrl: string;

  constructor() {}

  ngOnInit() {
    console.debug('Create');
    this.imageUrl =
      'https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fc%2Fc5%2FSpectrogram-19thC.png&f=1';
  }

  ngOnDestroy() {
    console.debug('Destroy');
    this.imageUrl = null;
  }
}
