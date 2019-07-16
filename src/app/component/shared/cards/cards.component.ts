import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
import { List } from 'immutable';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardsComponent implements OnInit {
  @Input() cards: List<{
    title: string;
    image?: { url: string; alt: string };
    description?: string;
    link?: string;
  }>;
  imageCards: boolean;

  constructor() {}

  ngOnInit() {
    this.checkRequiredFields('cards', this.cards);

    this.imageCards = false;
    this.cards.forEach(card => {
      if (card.image) {
        this.imageCards = true;
      } else if (this.imageCards) {
        // If some cards have images but others do not, throw error
        throw new Error(
          'If an image is given, all cards must have image component.'
        );
      }
    });
  }

  checkRequiredFields(name: string, input: any) {
    if (input === null || input === undefined) {
      throw new Error('Attribute ' + name + ' is required');
    }
  }
}

export interface Card {
  title: string;
  image?: { url: string; alt: string };
  description?: string;
  link?: string;
}
