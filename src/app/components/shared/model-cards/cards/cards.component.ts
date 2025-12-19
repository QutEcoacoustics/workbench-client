import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { CardComponent } from "../card/card.component";

type CardModel = Project | Region;

/**
 * Cards Component
 *
 * TODO This is only used for project cards. Simplify inputs to accept project, and add diamond icon
 * to signify when the user is the owner/editor of the project
 */
@Component({
  selector: "baw-model-cards",
  template: `
    <div class="row">
      @for (model of models() ?? []; track model.id) {
        <baw-card [model]="model" />
      }
      <div id="content">
        <ng-content />
      </div>
    </div>
  `,
  styleUrl: "./cards.component.scss",
  imports: [CardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardsComponent {
  public readonly models = input<CardModel[]>();
}
