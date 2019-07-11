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
    this.checkRequiredFields('cards', this.cards);

    this.imageCards = false;
    let noImageCards = false;
    this.cards.forEach(card => {
      if (card.image) {
        this.imageCards = true;
      } else {
        noImageCards = true;
      }
    });

    // If some cards have images but others do not, throw error
    if (this.imageCards && noImageCards) {
      throw new Error(
        'If an image is given, all cards must have image component.'
      );
    }
  }

  checkRequiredFields(name: string, input: any) {
    if (input === null || input === undefined) {
      throw new Error('Attribute ' + name + ' is required');
    }
  }
}
