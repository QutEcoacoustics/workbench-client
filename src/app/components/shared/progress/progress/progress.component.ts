import { Component, ViewEncapsulation, input } from "@angular/core";

@Component({
  selector: "baw-progress",
  template: `
    <div class="progress">
      @if (showZero()) {
        <div class="progress-bar zero w-100">0%</div>
      }
      @if (!showZero()) {
        <ng-content></ng-content>
      }
    </div>
  `,
  styles: [`
    .progress > baw-progress-bar {
      display: contents;
    }

    .zero {
      background-color: unset;
      color: black;
    }
  `],
  // eslint-disable-next-line @angular-eslint/use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None
})
export class ProgressComponent {
  public readonly showZero = input<boolean>(undefined);
}
