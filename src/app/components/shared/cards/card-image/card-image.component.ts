import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnChanges,
} from "@angular/core";
import { IS_SERVER_PLATFORM } from "src/app/app.helper";
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
      <a [bawUrl]="card.route">
        <img [alt]="card.title + ' image'" [src]="card.model.image" />
      </a>

      <!-- Card Body -->
      <div class="card-body">
        <!-- Title -->
        <h4 class="card-title">
          <a [bawUrl]="card.route">{{ card.title }}</a>
        </h4>

        <!-- Card Description -->
        <div class="card-text">
          <ng-container *ngTemplateOutlet="descriptionTemplate"></ng-container>
        </div>
      </div>
    </div>

    <ng-template #descriptionTemplate>
      <div class="truncate">
        <p *ngIf="!isServer; else noTruncation" [innerHtml]="description"></p>
      </div>
      <ng-template #noTruncation>
        <p>Loading</p>
      </ng-template>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardImageComponent implements OnChanges {
  @Input() public card: Card;
  public description: string;

  public constructor(
    @Inject(IS_SERVER_PLATFORM) public isServer: boolean,
    private ref: ChangeDetectorRef
  ) {}

  public ngOnChanges() {
    const description = this.card.description ?? "<i>No description given</i>";

    // No need for detection update if nothing changes
    if (this.description === description) {
      return;
    }

    this.description = description;
    this.ref.detectChanges();
  }
}
