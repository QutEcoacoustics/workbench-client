import { Component, Input } from "@angular/core";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { List } from "immutable";
import { CardComponent } from "../card/card.component";

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
      @for (model of models ?? []; track model) {
        <baw-card [model]="model"></baw-card>
      }
      <div id="content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrl: "./cards.component.scss",
  imports: [CardComponent],
})
export class CardsComponent {
  @Input() public models: List<Project | Region>;
}
