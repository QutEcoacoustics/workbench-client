import { Component, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "baw-progress",
  template: `
    <div class="progress">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      .progress > * {
        display: contents;
      }
    `,
  ],
  // eslint-disable-next-line @angular-eslint/use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
})
export class ProgressComponent {}
