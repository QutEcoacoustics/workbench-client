import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from "@angular/core";
import { stripHtml } from "@helpers/stripHtml/stripHtml";
import { Card } from "../cards.component";

/**
 * Card Component
 */
@Component({
  selector: "baw-card",
  styleUrls: ["./card.component.scss"],
  template: `
    <div class="card h-100">
      <h4 class="card-header text-center">
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
      <div class="card-body">
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
export class CardComponent implements OnChanges {
  @Input() public card: Card;
  public description: string;

  public ngOnChanges() {
    this.description =
      stripHtml(this.card.description) || "No description given";
  }
}
