import { Component, Input } from "@angular/core";
import { Statistic } from "./statistics.component";

@Component({
  selector: "baw-harvest-statistic-group",
  template: `
    <div class="card shadow">
      @for (stat of statisticGroup; track stat) {
        <baw-harvest-statistic-item
          [statistic]="stat"
          >
        </baw-harvest-statistic-item>
      }
      <ng-content></ng-content>
    </div>
    `,
  styles: [`
    .card {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      margin-bottom: 1rem;
    }
  `],
  standalone: false
})
export class StatisticGroupComponent {
  @Input() public statisticGroup: Statistic[];
}
