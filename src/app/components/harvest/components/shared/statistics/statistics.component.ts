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
  selector: "baw-harvest-statistics",
  template: `
    <div class="statistics">
      @for (statGroup of statistics; track statGroup) {
        <baw-harvest-statistic-group
          [statisticGroup]="statGroup"
        ></baw-harvest-statistic-group>
      }
    
      <ng-content></ng-content>
    </div>
    `,
  styles: [`
    .statistics {
      margin-bottom: 2rem;
      display: flex;
      flex-wrap: wrap;
      column-gap: 1rem;
      align-items: center;
      justify-content: center;
    }
  `],
  standalone: false
})
export class StatisticsComponent {
  @Input() public statistics: Statistic[][];
}
