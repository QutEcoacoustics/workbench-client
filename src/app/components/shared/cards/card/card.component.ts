import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
} from "@angular/core";
import { isSsr } from "src/app/app.helper";
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
          <!-- External header link wrapper -->
          <ng-container *ngIf="card.link; else route">
            <a [href]="card.link">{{ card.title }}</a>
          </ng-container>

          <!-- Internal header link wrapper -->
          <ng-template #route>
            <a [bawUrl]="card.route">{{ card.title }}</a>
          </ng-template>
        </ng-container>

        <!-- Header -->
        <ng-template #noLinkTitle>{{ card.title }}</ng-template>
      </h4>

      <div class="card-body">
        <!-- Card Description -->
        <!-- Line truncation fails in SSR https://github.com/DiZhou92/ngx-line-truncation/issues/49 -->
        <p
          *ngIf="!isSsr; else noTruncation"
          class="card-text"
          [ngClass]="{ 'font-italic': !card.description }"
          [line-truncation]="4"
          [innerHTML]="description"
        ></p>
        <ng-template #noTruncation>
          <p>Loading</p>
        </ng-template>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent implements OnChanges {
  @Input() public card: Card;
  public description: string;
  public isSsr: boolean;

  public constructor(private ref: ChangeDetectorRef) {}

  public ngOnChanges() {
    this.description = this.card.description ?? "No description given";
    this.isSsr = isSsr();
    this.ref.detectChanges();
  }
}
