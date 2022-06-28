import { Component, Input, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "baw-progress",
  template: `
    <div class="progress">
      <div *ngIf="showZero" class="progress-bar zero w-100">0%</div>
      <ng-content *ngIf="!showZero"></ng-content>
    </div>
  `,
  styles: [
    `
      .progress > baw-progress-bar {
        display: contents;
      }

      .zero {
        background-color: unset;
        color: black;
      }
    `,
  ],
  // eslint-disable-next-line @angular-eslint/use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
})
export class ProgressComponent {
  @Input() public showZero: boolean;
}
