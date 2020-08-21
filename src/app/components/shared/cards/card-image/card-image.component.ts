import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from "@angular/core";
import { stripHtml } from "@helpers/stripHtml/stripHtml";
import { Card } from "../cards.component";

/**
 * Card Image Component
 */
@Component({
  selector: "baw-card-image",
  styleUrls: ["./card-image.component.scss"],
  template: `
    <div class="card h-100">
      <!-- Card Image -->
      <ng-container *ngIf="card.link || card.route; else noLinkImage">
        <ng-container *ngIf="card.link; else route">
          <a [href]="card.link">
            <img [alt]="card.title + ' image'" [src]="card.model.image" />
          </a>
        </ng-container>

        <ng-template #route>
          <a [routerLink]="card.route">
            <img [alt]="card.title + ' image'" [src]="card.model.image" />
          </a>
        </ng-template>
      </ng-container>

      <ng-template #noLinkImage>
        <img [alt]="card.title + ' image'" [src]="card.model.image" />
      </ng-template>

      <!-- Card Body -->
      <div class="card-body">
        <!-- Title -->
        <h4 class="card-title">
          <ng-container *ngIf="card.link || card.route; else noLinkTitle">
            <ng-container *ngIf="card.link; else route">
              <a [href]="card.link">{{ card.title }}</a>
            </ng-container>

            <ng-template #route>
              <a [routerLink]="card.route">
                {{ card.title }}
              </a>
            </ng-template>
          </ng-container>

          <ng-template #noLinkTitle>{{ card.title }}</ng-template>
        </h4>

        <!-- Card Description -->
        <p
          class="card-text"
          [ngClass]="{ 'font-italic': !card.description }"
          [line-truncation]="4"
        >
          {{ description }}
        </p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardImageComponent implements OnChanges {
  @Input() public card: Card;
  public description: string;

  public ngOnChanges() {
    this.description =
      stripHtml(this.card.description) || "No description given";
  }
}
