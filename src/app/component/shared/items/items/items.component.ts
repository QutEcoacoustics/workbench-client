import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from "@angular/core";
import { ItemInterface } from "../item/item.component";

@Component({
  selector: "app-items",
  template: `
    <div class="row pb-5">
      <div class="col-sm-6">
        <ul class="list-group" *ngFor="let stat of groupOne">
          <app-items-item
            [icon]="stat.icon"
            [name]="stat.name"
            [value]="stat.value"
          ></app-items-item>
        </ul>
      </div>
      <div class="col-sm-6">
        <ul class="list-group" *ngFor="let stat of groupTwo">
          <app-items-item
            [icon]="stat.icon"
            [name]="stat.name"
            [value]="stat.value"
          ></app-items-item>
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
