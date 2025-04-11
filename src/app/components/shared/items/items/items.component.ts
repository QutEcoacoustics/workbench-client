import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from "@angular/core";
import { List } from "immutable";
import { IItem } from "../item/item.component";

/**
 * Items Component.
 * This creates a list of items split into two columns.
 */
@Component({
  selector: "baw-items",
  template: `
    <div class="row pb-3">
      <div class="col-sm-6">
        <ul class="list-group">
          @for (stat of groupOne; track stat) {
            <li class="list-group-item">
              <baw-items-item
                [icon]="stat.icon"
                [name]="stat.name"
                [tooltip]="stat.tooltip"
                [value]="stat.value"
                [color]="stat.color"
              ></baw-items-item>
            </li>
          }
        </ul>
      </div>
      <div class="col-sm-6">
        <ul class="list-group">
          @for (stat of groupTwo; track stat) {
            <li class="list-group-item">
              <baw-items-item
                [icon]="stat.icon"
                [name]="stat.name"
                [tooltip]="stat.tooltip"
                [value]="stat.value"
                [color]="stat.color"
              ></baw-items-item>
            </li>
          }
        </ul>
      </div>
    </div>
  `,
  // Pure Component
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ItemsComponent implements OnInit, OnChanges {
  @Input() public items: List<IItem>;

  public groupOne: List<IItem>;
  public groupTwo: List<IItem>;

  public constructor() {}

  public ngOnInit() {
    this.ngOnChanges();
  }

  public ngOnChanges() {
    if (!this.items) {
      this.groupOne = List([]);
      this.groupTwo = List([]);
      return;
    }

    const midIndex = Math.ceil(this.items.count() / 2);
    this.groupOne = this.items.slice(0, midIndex);
    this.groupTwo = this.items.slice(midIndex, this.items.count());
  }
}
