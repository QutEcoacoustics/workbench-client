import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardsComponent implements OnInit {
  @Input() cards: {
    title: string;
    image?: { url: string; alt: string };
    description?: string;
    link?: string;
  }[];
  imageCards: boolean;

  constructor() {}

  ngOnInit() {
    this.imageCards = false;
    this.cards.forEach(card => {
      if (card.image) {
        this.imageCards = true;
        return;
      }
    });
  }
}
