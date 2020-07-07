import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
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
          [card]="item"
          class="col-lg-4 col-sm-6 portfolio-item mb-4"
        ></baw-card-image>
      </ng-container>
      <ng-template #defaultCards>
        <baw-card
          *ngFor="let item of cards"
          [card]="item"
          class="col-lg-4 col-sm-6 mb-4"
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
export class CardsComponent implements OnInit, OnChanges {
  @Input() cards: List<Card>;
  @Input() content: boolean;
  imageCards: boolean;

  constructor() {}

  ngOnInit() {
    this.ngOnChanges();
  }

  ngOnChanges() {
    if (!this.cards) {
      this.cards = List<Card>([]);
    }

    this.imageCards = false;
    this.cards.forEach((card) => {
      if (card.model) {
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
  model?: AbstractModel & { image: ImageUrl[] };
  description?: string;
  link?: string;
  route?: string | [string, string];
}
