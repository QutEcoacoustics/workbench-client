import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

/**
 * Loading Animation
 */
@Component({
  selector: "baw-loading",
  template: `
    <ng-container *ngIf="display">
      <h4 *ngIf="title" class="text-center">{{ title }}</h4>
      <div id="baw-spinner" class="d-flex justify-content-center">
        <div class="spinner-border" [ngClass]="'text-' + type" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent {
  @Input() public display: boolean;
  @Input() public title: string;
  @Input() public type:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark" = "info";

  constructor() {}
}
