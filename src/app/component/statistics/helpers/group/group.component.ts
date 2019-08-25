import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from "@angular/core";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

@Component({
  selector: "app-group",
  template: `
    <div class="row pb-5">
      <div class="col-sm-6">
        <ul class="list-group" *ngFor="let stat of groupOne">
          <app-statistic
            [icon]="stat.icon"
            [name]="stat.name"
            [value]="stat.value"
          ></app-statistic>
        </ul>
      </div>
      <div class="col-sm-6">
        <ul class="list-group" *ngFor="let stat of groupTwo">
          <app-statistic
            [icon]="stat.icon"
            [name]="stat.name"
            [value]="stat.value"
          ></app-statistic>
        </ul>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupComponent implements OnInit {
  @Input() statistics: {
    icon: IconProp;
    name: string;
    value: string | number;
  }[];

  groupOne: {
    icon: IconProp;
    name: string;
    value: string | number;
  }[];
  groupTwo: {
    icon: IconProp;
    name: string;
    value: string | number;
  }[];

  constructor() {}

  ngOnInit() {
    const midIndex = Math.ceil(this.statistics.length / 2);

    this.groupOne = this.statistics.slice(0, midIndex);
    this.groupTwo = this.statistics.slice(midIndex, this.statistics.length);
  }
}
