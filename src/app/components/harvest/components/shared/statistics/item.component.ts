import { Component, Input } from "@angular/core";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { NgClass } from "@angular/common";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { Statistic } from "./statistics.component";

@Component({
  selector: "baw-harvest-statistic-item",
  template: `
    <div class="card-body" [ngbTooltip]="statistic.tooltip">
      <div class="icon" [ngClass]="'text-bg-' + statistic.bgColor">
        <fa-icon [icon]="statistic.icon" [ngClass]="'text-' + statistic.color"></fa-icon>
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
        min-width: 7.5rem;
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
  imports: [NgbTooltip, NgClass, FaIconComponent],
})
export class StatisticItemComponent {
  @Input() public statistic: Statistic;
}
