import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

/**
 * Loading Animation
 */
@Component({
  selector: "baw-loading",
  template: `
    <ng-container *ngIf="display">
      <h4 *ngIf="title" class="text-center">Loading</h4>
      <div id="baw-spinner" class="d-flex justify-content-center">
        <div class="spinner-border" [ngClass]="type" role="status">
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
    | "text-primary"
    | "text-secondary"
    | "text-success"
    | "text-danger"
    | "text-warning"
    | "text-info"
    | "text-light"
    | "text-dark" = "text-info";

  constructor() {}
}
