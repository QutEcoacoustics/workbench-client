import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Card } from "../cards.component";

/**
 * Card Image Component
 */
@Component({
  selector: "baw-card-image",
  styleUrls: ["./card-image.component.scss"],
  template: `
    <div class="card h-100">
      <!-- Image -->
      <div class="card-image">
        <a [bawUrl]="card.route">
          <img [alt]="card.title + ' image'" [src]="card.model.images" />
        </a>
      </div>

      <div class="card-body">
        <!-- Title -->
        <a class="card-title" [bawUrl]="card.route">
          <h4 [innerText]="card.title"></h4>
        </a>

        <!-- Description -->
        <div class="card-text truncate">
          <p
            [innerHtml]="card.description ?? '<i>No description given</i>'"
          ></p>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardImageComponent {
  @Input() public card: Card;
}
