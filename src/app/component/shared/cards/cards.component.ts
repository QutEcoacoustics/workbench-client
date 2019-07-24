import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnChanges
} from '@angular/core';
import { List } from 'immutable';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardsComponent implements OnChanges {
  @Input() cards: List<{
    title: string;
    image?: { url: string; alt: string };
    description?: string;
    link?: string;
  }>;
  imageCards: boolean;

  constructor() {}

  ngOnChanges() {
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

  /**
   * Check input field is provided
   * @param name Input variable name
   * @param input Input variable
   */
  checkRequiredFields(name: string, input: any) {
    if (input === null || input === undefined) {
      throw new Error('Attribute ' + name + ' is required');
    }
  }
}

/**
 * Card Interface
 */
export interface Card {
  title: string;
  image?: { url: string; alt: string };
  description?: string;
  link?: string;
}
