import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
    <div class="row">
      <ng-container *ngIf="imageCards; else defaultCards">
        <baw-card-image
          *ngFor="let item of cards"
          class="col-xl-4 col-lg-6"
          [card]="item"
        ></baw-card-image>
      </ng-container>
      <ng-template #defaultCards>
        <baw-card
          *ngFor="let item of cards"
          class="col-xl-4 col-lg-6"
          [card]="item"
        ></baw-card>
      </ng-template>
      <div id="content" class="col-xl-4 col-lg-6">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrls: ["./cards.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardsComponent implements OnChanges {
  @Input() public cards: List<Card>;
  public imageCards: boolean;

  public constructor(private ref: ChangeDetectorRef) {}

  public ngOnChanges() {
    this.cards = this.cards ?? List<Card>([]);

    let hasNormalCards = false;
    let hasImageCards = false;

    for (const card of this.cards) {
      if (card.model?.image) {
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
    }

    this.imageCards = hasImageCards;
    this.ref.detectChanges();
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
  route?: string;
}
