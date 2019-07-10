import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';

@Component({
  selector: 'app-card-image',
  templateUrl: './card-image.component.html',
  styleUrls: ['./card-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardImageComponent implements OnInit {
  @Input() title: string;
  @Input() image: { url: string; alt: string };
  @Input() link: string;
  @Input() description?: string;

  constructor() {}

  ngOnInit() {}
}
