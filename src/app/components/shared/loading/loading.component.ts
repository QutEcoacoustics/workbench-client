import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BootstrapColorTypes } from "src/app/app.helper";

/**
 * Loading Animation
 */
@Component({
  selector: "baw-loading",
  template: `
    <ng-container *ngIf="display">
      <h4 *ngIf="title" class="text-center">{{ title }}</h4>
      <div id="baw-spinner" class="d-flex justify-content-center m-3">
        <div class="spinner-border" [ngClass]="'text-' + type" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent {
  @Input() public display = true;
  @Input() public title: string;
  @Input() public type: BootstrapColorTypes = "info";

  constructor() {}
}
