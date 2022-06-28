import { Component, Input } from "@angular/core";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { BootstrapColorTypes } from "@helpers/bootstrapTypes";

export interface Statistic {
  icon: IconProp;
  color?: BootstrapColorTypes;
  bgColor: BootstrapColorTypes;
  label: string;
  value: string;
  tooltip?: string;
}

@Component({
  selector: "baw-harvest-statistic-item",
  template: `
    <div class="card-body" [ngbTooltip]="statistic.tooltip">
      <div class="icon" [ngClass]="'bg-' + statistic.bgColor">
        <fa-icon
          [icon]="statistic.icon"
          [ngClass]="'text-' + statistic.color"
        ></fa-icon>
      </div>

      <div class="fs-5 font-monospace">
        {{ statistic.value }}
        <ng-content select="#value"></ng-content>
      </div>
      <div class="title fs-6 text-muted">
        {{ statistic.label }}
        <ng-content select="#label"></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      .card-body {
        text-align: center;
        min-width: 10rem;
      }

      .icon {
        margin: 0 auto 0.5rem auto;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50px;
        height: 50px;
      }

      .title {
        font-weight: bold;
      }
    `,
  ],
})
export class StatisticItemComponent {
  @Input() public statistic: Statistic;
}

@Component({
  selector: "baw-harvest-statistic-group",
  template: `
    <div class="card shadow">
      <baw-harvest-statistic-item
        *ngFor="let stat of statisticGroup"
        [statistic]="stat"
      >
      </baw-harvest-statistic-item>
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      .card {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin-bottom: 1rem;
      }
    `,
  ],
})
export class StatisticGroupComponent {
  @Input() public statisticGroup: Statistic[];
}

@Component({
  selector: "baw-harvest-statistics",
  template: `
    <div class="statistics">
      <baw-harvest-statistic-group
        *ngFor="let statGroup of statistics"
        [statisticGroup]="statGroup"
      ></baw-harvest-statistic-group>

      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      .statistics {
        margin-bottom: 2rem;
        display: flex;
        flex-wrap: wrap;
        column-gap: 1rem;
        align-items: center;
        justify-content: center;
      }
    `,
  ],
})
export class StatisticsComponent {
  @Input() public statistics: Statistic[][];
}
