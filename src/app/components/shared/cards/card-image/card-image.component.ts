import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
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
      <!-- Image -->
      <a *ngIf="card.model?.image" [bawUrl]="card.route">
        <div class="card-image">
          <img [alt]="card.title + ' image'" [src]="card.model.image" />
        </div>
      </a>

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

  public constructor(@Inject(IS_SERVER_PLATFORM) public isServer: boolean) {}
}
