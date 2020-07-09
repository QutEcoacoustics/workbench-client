import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from "@angular/core";
import { ImageUrl } from "@interfaces/apiInterfaces";
import { AbstractModel } from "@models/AbstractModel";
import { List } from "immutable";

/**
 * Cards Component
 */
@Component({
  selector: "baw-cards",
  template: `
    <div class="row justify-content-center">
      <ng-container *ngIf="imageCards; else defaultCards">
        <baw-card-image
          *ngFor="let item of cards"
          class="col-lg-4 col-sm-6 portfolio-item mb-4"
          [card]="item"
        ></baw-card-image>
      </ng-container>
      <ng-template #defaultCards>
        <baw-card
          *ngFor="let item of cards"
          class="col-lg-4 col-sm-6 mb-4"
          [card]="item"
        ></baw-card>
      </ng-template>
      <div
        *ngIf="content"
        id="content"
        class="col-lg-4 col-sm-6 mb-4 d-flex center content"
      >
        <ng-content></ng-content>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardsComponent implements OnChanges {
  @Input() cards: List<Card>;
  @Input() content: boolean;
  public imageCards: boolean;

  constructor() {}

  ngOnChanges() {
    if (!this.cards) {
      this.cards = List<Card>([]);
    }

    let hasNormalCards = false;
    let hasImageCards = false;
    this.cards.forEach((card) => {
      if (card.model) {
        hasImageCards = true;
      } else {
        hasNormalCards = true;
      }

      // If some cards have images but others do not, throw error
      if (hasNormalCards && hasImageCards) {
        throw new Error(
          "If an image is given, all cards must have image component."
        );
      }
    });
    this.imageCards = hasImageCards;
  }
}

/**
 * Card Interface
 */
export interface Card {
  title: string;
  model?: AbstractModel & { image: ImageUrl[] };
  description?: string;
  link?: string;
  route?: string | [string, string];
}
