import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  OnInit,
  input
} from "@angular/core";
import { List } from "immutable";
import { IItem, ItemComponent } from "../item/item.component";

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
  imports: [ItemComponent],
})
export class ItemsComponent implements OnInit, OnChanges {
  public readonly items = input<List<IItem>>(undefined);

  public groupOne: List<IItem>;
  public groupTwo: List<IItem>;

  public constructor() {}

  public ngOnInit() {
    this.ngOnChanges();
  }

  public ngOnChanges() {
    const items = this.items();
    if (!items) {
      this.groupOne = List([]);
      this.groupTwo = List([]);
      return;
    }

    const midIndex = Math.ceil(items.count() / 2);
    this.groupOne = items.slice(0, midIndex);
    this.groupTwo = items.slice(midIndex, items.count());
  }
}
