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
    <a class="text-reset" [bawUrl]="card.route">
      <div class="card h-100">
        <!-- Image -->
        <div class="card-image">
          <img [alt]="card.title + ' image'" [src]="card.model.image" />
        </div>

        <div class="card-body">
          <!-- Title -->
          <h4 class="card-title" [innerText]="card.title"></h4>

          <!-- Description -->
          <div class="card-text truncate">
            <p [innerHtml]="description"></p>
          </div>
        </div>
      </div>
    </a>
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
    if (this.description !== description) {
      this.description = description;
      this.ref.detectChanges();
    }
  }
}
