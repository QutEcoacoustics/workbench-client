import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from "@angular/core";
import { ItemInterface } from "../item/item.component";

/**
 * Items Component.
 * This creates a list of items split into two columns.
 */
@Component({
  selector: "app-items",
  template: `
    <div class="row pb-3">
      <div class="col-sm-6">
        <ul class="list-group">
          <li class="list-group-item" *ngFor="let stat of groupOne">
            <app-items-item
              [icon]="stat.icon"
              [name]="stat.name"
              [value]="stat.value"
            ></app-items-item>
          </li>
        </ul>
      </div>
      <div class="col-sm-6">
        <ul class="list-group">
          <li class="list-group-item" *ngFor="let stat of groupTwo">
            <app-items-item
              [icon]="stat.icon"
              [name]="stat.name"
              [value]="stat.value"
            ></app-items-item>
          </li>
        </ul>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemsComponent implements OnInit {
  @Input() items: ItemInterface[];

  groupOne: ItemInterface[];
  groupTwo: ItemInterface[];

  constructor() {}

  ngOnInit() {
    if (!this.items) {
      return;
    }

    const midIndex = Math.ceil(this.items.length / 2);
    this.groupOne = this.items.slice(0, midIndex);
    this.groupTwo = this.items.slice(midIndex, this.items.length);
  }
}
