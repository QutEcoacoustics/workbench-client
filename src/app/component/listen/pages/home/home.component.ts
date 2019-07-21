import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';
import { BawApiService } from 'src/app/services/baw-api/baw-api.service';

@Component({
  selector: 'app-listen',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListenComponent implements OnInit {
  imageUrl: string;
  loadAnnotorious: string;

  constructor(private api: BawApiService) {}

  ngOnInit() {
    this.imageUrl =
      'https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fc%2Fc5%2FSpectrogram-19thC.png&f=1';
    this.loadAnnotorious = `
      function init() {
        if (typeof anno === 'undefined') {
          setTimeout(init, 500);
          return;
        }

        anno.reset();
        anno.makeAnnotatable(document.getElementById('myImage'));
      }
    `;
  }
}
