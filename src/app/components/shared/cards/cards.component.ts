import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { ImageUrl } from "@interfaces/apiInterfaces";
import { AbstractModel } from "@models/AbstractModel";
import { List } from "immutable";

/**
 * Cards Component
 *
 * TODO This is only used for project cards. Simplify inputs to accept project, and add diamond icon
 * to signify when the user is the owner/editor of the project
 */
@Component({
  selector: "baw-cards",
  template: `
    <div class="row">
      <baw-card-image
        *ngFor="let item of cards ?? []"
        class="col-xl-4 col-lg-6"
        [card]="item"
      ></baw-card-image>
      <div id="content" class="col-xl-4 col-lg-6">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrls: ["./cards.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardsComponent {
  @Input() public cards: List<Card>;
}

/**
 * Card Interface
 */
export interface Card {
  title: string;
  model: AbstractModel & { imageUrls: ImageUrl[] };
  description?: string;
  route: string;
}
