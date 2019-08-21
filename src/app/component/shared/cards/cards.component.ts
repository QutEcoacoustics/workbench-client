import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges
} from "@angular/core";
import { List } from "immutable";

@Component({
  selector: "app-cards",
  templateUrl: "./cards.component.html",
  styleUrls: ["./cards.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardsComponent implements OnChanges {
  @Input() cards: List<Card>;
  imageCards: boolean;

  constructor() {}

  ngOnChanges() {
    if (!this.cards) {
      this.cards = List<Card>([]);
    }

    this.imageCards = false;
    this.cards.forEach(card => {
      if (card.image) {
        this.imageCards = true;
      } else if (this.imageCards) {
        // If some cards have images but others do not, throw error
        throw new Error(
          "If an image is given, all cards must have image component."
        );
      }
    });
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
  route?: string | [string, string];
}
