import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { List } from 'immutable';
import { ItemInterface } from '../item/item.component';

/**
 * Items Component.
 * This creates a list of items split into two columns.
 */
@Component({
  selector: 'baw-items',
  template: `
    <div class="row pb-3">
      <div class="col-sm-6">
        <ul class="list-group">
          <li class="list-group-item" *ngFor="let stat of groupOne">
            <baw-items-item
              [icon]="stat.icon"
              [name]="stat.name"
              [value]="stat.value"
            ></baw-items-item>
          </li>
        </ul>
      </div>
      <div class="col-sm-6">
        <ul class="list-group">
          <li class="list-group-item" *ngFor="let stat of groupTwo">
            <baw-items-item
              [icon]="stat.icon"
              [name]="stat.name"
              [value]="stat.value"
            ></baw-items-item>
          </li>
        </ul>
      </div>
    </div>
  `,
  // Pure Component
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemsComponent implements OnInit, OnChanges {
  @Input() public items: List<ItemInterface>;

  public groupOne: List<ItemInterface>;
  public groupTwo: List<ItemInterface>;

  constructor() {}

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
